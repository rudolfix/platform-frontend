import { all, call, fork, neuCall, put, race, SagaGenerator, select, take } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings, TEtoSpecsData } from "@neufund/shared-modules";
import { DataUnavailableError, secondsToMs } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

import { EGovernanceErrorMessage } from "../../components/translatedMessages/messages";
import { createNotificationMessage } from "../../components/translatedMessages/utils";
import { symbols } from "../../di/symbols";
import { IControllerGovernance } from "../../lib/contracts/IControllerGovernance";
import { ITokenControllerHook } from "../../lib/contracts/ITokenControllerHook";
import { actions as globalActions, TActionFromCreator } from "../actions";
import { etoFlowActions } from "../eto-flow/actions";
import { loadIssuerEto } from "../eto-flow/sagas";
import { selectIssuerCompany, selectIssuerEto } from "../eto-flow/selectors";
import { webNotificationUIModuleApi } from "../notification-ui/module";
import { neuTakeLatest } from "../sagasUtils";
import { actions } from "./actions";
import { GOVERNANCE_CONTRACT_ID } from "./constants";
import { selectGovernanceData, selectGovernanceVisible } from "./selectors";
import { EGovernanceControllerState, TResolution } from "./types";
import { convertGovernanceActionNumberToEnum } from "./utils";
import { EProcessState } from "../../utils/enums/processStates";
import {
  EModalState,
  initialGovernanceUpdateModalState,
  TGovernanceViewSuccessState
} from "./reducer";

type TGlobalDependencies = unknown;

export function* selectGovernanceController(
  equityTokenContractAddress: string,
): Generator<any, IControllerGovernance, any> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
  });

  const tokenControllerHook: ITokenControllerHook = yield contractsService.getTokenControllerHook(
    equityTokenContractAddress,
  );
  const tokenController = yield tokenControllerHook.tokenController;
  const governanceController: IControllerGovernance = yield contractsService.getControllerGovernance(
    tokenController,
  );

  return governanceController;
}

function* checkGovernanceVisibility(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof etoFlowActions.setEto>,
): Generator<any, void, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  const eto: TEtoSpecsData = action.payload.eto;

  if (eto.equityTokenContractAddress) {
    const governanceController: IControllerGovernance = yield* call(
      selectGovernanceController,
      eto.equityTokenContractAddress,
    );
    const controllerState: BigNumber = yield governanceController.state;

    const visibility =
      controllerState && controllerState.toString() !== EGovernanceControllerState.SETUP.toString();
    logger.info("Governance visibility:" + visibility);
    yield put(actions.setGovernanceVisibility(visibility));
  } else {
    logger.info("Governance not visible for ETO" + eto.etoId);
    yield put(actions.setGovernanceVisibility(false));
  }
}

function* checkGovernanceCompatibility(eto: TEtoSpecsData): Generator<any, boolean, any> {
  const governanceController: IControllerGovernance = yield* call(
    selectGovernanceController,
    eto.equityTokenContractAddress,
  );
  const contractId = yield governanceController.contractId();
  return contractId[0] === GOVERNANCE_CONTRACT_ID;
}

function* loadResolutionForId(
  governanceController: IControllerGovernance,
  id: string
): Generator<any, TResolution, any> {
  const [action, , startedAt] = yield governanceController.resolution(id);

  return {
    action: convertGovernanceActionNumberToEnum(action),
    id,
    draft: false,
    startedAt: new Date(secondsToMs(startedAt.toNumber())),
  };
}

function* loadResolutions(
  governanceController: IControllerGovernance,
): Generator<any, TResolution[], any> {
  const resolutionsList = yield governanceController.resolutionsList;
  return yield all(
    resolutionsList.map((resolutionId: string) => call(loadResolutionForId, governanceController, resolutionId)),
  );
}

export function* loadInitialGeneralInformationView(
  governanceController: IControllerGovernance,
): Generator<any, void, any> {
  const resolutions = yield* call(loadResolutions, governanceController)

  const company = yield* select(selectIssuerCompany)
  if (!company) {
    throw new DataUnavailableError("loadInitialGeneralInformationView: issuer company cannot be missing at this stage")
  }

  const oldState = yield* select(selectGovernanceData) //fixme this is only because of tabVisible !!

  const newState = {
    processState: EProcessState.SUCCESS,
    tabVisible: oldState.tabVisible,
    resolutions,
    companyBrandName: company.brandName,
    governanceUpdateModalState: { modalState: EModalState.CLOSED }
  } as const

  yield put(actions.setGovernanceUpdateData(newState))
} //fixme catch errors


function* governanceGeneralInformationViewController() {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  let eto = yield* select(selectIssuerEto);
  if (!eto) {
    yield neuCall(loadIssuerEto);
    // wait for eto to load
    yield take(actions.setGovernanceVisibility);

    eto = yield select(selectIssuerEto);
    if (!eto) {
      logger.info("loadIssuerEto encountered an exception, couldn't load Governance");
      return;
    }
  }

  const isGovernanceVisible = yield select(selectGovernanceVisible);
  const isGovernanceCompatible = yield call(checkGovernanceCompatibility, eto);

  if (!isGovernanceVisible) {
    logger.info("Governance not setup");
    yield put(globalActions.routing.goToDashboard());
    return;
  } else if (!isGovernanceCompatible) {
    logger.info("Governance incompatible for ETO: " + eto.etoId);

    yield put(globalActions.routing.goToDashboard());
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EGovernanceErrorMessage.CONTRACT_VERSION_NOT_SUPPORTED),
        {
          ["data-test-id"]: "modules.governance.contract-version-not-supported",
        },
      ),
    );
    return;
  }

  const governanceController: IControllerGovernance = yield* call(
    selectGovernanceController,
    eto.equityTokenContractAddress,
  );

  yield call(loadInitialGeneralInformationView, governanceController)

  while (true) {
    const oldState = yield* select(selectGovernanceData)
    let newState;
    if (processStateIsSuccess<TGovernanceViewSuccessState & { tabVisible: boolean }>(oldState)) {

      const update: {
        updateForm?: ReturnType<typeof actions.onFormChange>,
        closeGovernanceUpdateModal?: ReturnType<typeof actions.closeGovernanceUpdateModal>,
        openGovernanceUpdateModal?: ReturnType<typeof actions.openGovernanceUpdateModal>
      } = yield race({
        closeGovernanceUpdateModal: take(actions.closeGovernanceUpdateModal),
        openGovernanceUpdateModal: take(actions.openGovernanceUpdateModal),
        updateForm: take(actions.onFormChange)
      })

      console.log("update", update, oldState)
      if (update.updateForm && oldState.governanceUpdateModalState.modalState === EModalState.OPEN) {
        const { fieldPath, formId, newValue } = update.updateForm.payload
        console.log("governanceGeneralInformationViewController", fieldPath, formId, newValue)
        newState = {
          ...oldState,
          governanceUpdateModalState: {
            ...oldState.governanceUpdateModalState,
            [formId]: {
              [fieldPath]: {
                ...oldState.governanceUpdateModalState[formId][fieldPath],
                value: newValue
              }
            }
          }
        }
      } else if (update.closeGovernanceUpdateModal) {
        newState = {
          ...oldState,
          governanceUpdateModalState: { modalState: EModalState.CLOSED } as const
        }
      } else if (update.openGovernanceUpdateModal) {
        newState = {
          ...oldState,
          governanceUpdateModalState: initialGovernanceUpdateModalState
        }
      } else {
        continue
      }
      console.log("newState", newState)
      //fixme check for new data
      yield put(actions.setGovernanceUpdateData(newState))
    }
  }
}

const processStateIsSuccess = <T>(obj: { processState: EProcessState }): obj is { processState: EProcessState.SUCCESS } & T =>
  obj.processState === EProcessState.SUCCESS


export function* governanceModuleSagas(): SagaGenerator<void> {
  yield fork(neuTakeLatest, actions.loadGeneralInformationView, governanceGeneralInformationViewController);
  yield fork(neuTakeLatest, etoFlowActions.setEto, checkGovernanceVisibility);
}
