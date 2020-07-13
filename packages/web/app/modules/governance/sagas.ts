import { all, call, fork, put, SagaGenerator, select, take } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";
import { secondsToMs } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

import { EGovernanceErrorMessage } from "../../components/translatedMessages/messages";
import { createNotificationMessage } from "../../components/translatedMessages/utils";
import { symbols } from "../../di/symbols";
import { TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IControllerGovernance } from "../../lib/contracts/IControllerGovernance";
import { ITokenControllerHook } from "../../lib/contracts/ITokenControllerHook";
import { actions as globalActions, TActionFromCreator } from "../actions";
import { etoFlowActions } from "../eto-flow/actions";
import { selectIssuerEto } from "../eto-flow/selectors";
import { webNotificationUIModuleApi } from "../notification-ui/module";
import { neuTakeLatest } from "../sagasUtils";
import { actions } from "./actions";
import { GOVERNANCE_CONTRACT_ID } from "./constants";
import { selectGovernanceVisible } from "./selectors";
import { EGovernanceControllerState, IResolution } from "./types";
import { convertGovernanceActionNumberToEnum } from "./utils";

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

export function* loadGeneralInformationView(): Generator<any, void, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  let eto = yield select(selectIssuerEto);
  if (!eto) {
    // wait for eto to load
    yield take(actions.setGovernanceVisibility);

    eto = yield select(selectIssuerEto);
    if (!eto) {
      logger.info("loadIssuerEto encountered an exception, couldn't load Governance");
      return;
    }
  }

  const isGovernanceVisible = yield select(selectGovernanceVisible);
  if (!isGovernanceVisible) {
    logger.info("Governance not setup");
    yield put(globalActions.routing.goToDashboard());
    return;
  }

  const isGovernanceCompatible = yield call(checkGovernanceCompatibility, eto);

  if (isGovernanceCompatible) {
    const governanceController: IControllerGovernance = yield* call(
      selectGovernanceController,
      eto.equityTokenContractAddress,
    );
    const resolutionsList = yield governanceController.resolutionsList;

    const loadResolutionForId = function*(id: string): Generator<any, IResolution, any> {
      const [action, , startedAt] = yield governanceController.resolution(id);
      return {
        action: convertGovernanceActionNumberToEnum(action),
        id,
        draft: false,
        startedAt: new Date(secondsToMs(startedAt.toNumber())),
      };
    };

    const resolutions: IResolution[] = yield all(
      resolutionsList.map((resolutionId: string) => call(loadResolutionForId, resolutionId)),
    );

    yield put(actions.setGovernanceResolutions(resolutions));
  } else {
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
  }
}

export function* governanceModuleSagas(): SagaGenerator<void> {
  yield fork(neuTakeLatest, actions.loadGeneralInformationView, loadGeneralInformationView);
  yield fork(neuTakeLatest, etoFlowActions.setEto, checkGovernanceVisibility);
}
