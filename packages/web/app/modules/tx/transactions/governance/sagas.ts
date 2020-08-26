import { call, put, select, takeLatest } from "@neufund/sagas";
import { coreModuleApi, ETxType, neuGetBindings, TEtoSpecsData } from "@neufund/shared-modules";

import { symbols } from "../../../../di/symbols";
import { IControllerGovernance } from "../../../../lib/contracts/IControllerGovernance";
import { ITxData } from "../../../../lib/web3/types";
import { actions, TActionFromCreator } from "../../../actions";
import { selectIssuerCompany, selectIssuerEto } from "../../../eto-flow/selectors";
import { governanceModuleApi } from "../../../governance/module";
import { selectGovernanceController } from "../../../governance/sagas";
import { EGovernanceAction } from "../../../governance/types";
import { governanceActionToLabel } from "../../../governance/utils";
import { selectEthereumAddress } from "../../../web3/selectors";
import { txSendSaga } from "../../sender/sagas";
import { selectStandardGasPriceWithOverHead } from "../../sender/selectors";
import { txTransactionsActions } from "../actions";

type TGlobalDependencies = unknown;

export function* generatePublishResolutionTransaction(
  updateTitle: string,
  resolutionId: string,
  resolutionDocumentUrl: string,
  action: EGovernanceAction,
): Generator<any, any, any> {
  // TODO hardcoded until we have upload

  const { web3Manager } = yield* neuGetBindings({
    web3Manager: symbols.web3Manager,
  });

  const eto: TEtoSpecsData = yield select(selectIssuerEto);
  const governanceController: IControllerGovernance = yield* call(
    selectGovernanceController,
    eto.equityTokenContractAddress,
  );
  const userAddress = yield select(selectEthereumAddress);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const toAddress = yield governanceController.address;

  const data = yield governanceController
    .generalResolutionTx(resolutionId, action, updateTitle, resolutionDocumentUrl)
    .getData();

  const txInitialDetails = {
    to: toAddress,
    value: "0",
    data,
    from: userAddress,
    gasPrice: gasPriceWithOverhead,
  };

  const gas: string = yield web3Manager.estimateGasWithOverhead(txInitialDetails);
  const txDetails: ITxData = {
    ...txInitialDetails,
    gas,
  };

  return txDetails;
}

function* startPublishResolutionUpdateFlow(
  _: TGlobalDependencies,
  params: {
    updateTitle: string;
    resolutionId: string;
    resolutionDocumentUrl: string;
  },
): Generator<any, any, any> {
  const { updateTitle, resolutionId, resolutionDocumentUrl } = params;

  const company = yield select(selectIssuerCompany);
  // TODO hardcoded until we support other types
  const action = EGovernanceAction.COMPANY_NONE;

  const txDetails: ITxData = yield* call(
    generatePublishResolutionTransaction,
    updateTitle,
    resolutionId,
    resolutionDocumentUrl,
    action,
  );

  yield put(actions.txSender.setTransactionData(txDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary<ETxType.EXECUTE_RESOLUTION>({
      documentTitle: updateTitle,
      type: governanceActionToLabel(action, company.brandName) as string,
    }),
  );
}

function* txStartPublishResolutionUpdate(
  action: TActionFromCreator<typeof txTransactionsActions.startPublishResolutionUpdate>,
): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    yield txSendSaga({
      type: ETxType.EXECUTE_RESOLUTION,
      transactionFlowGenerator: startPublishResolutionUpdateFlow,
      extraParam: action.payload,
    });

    logger.info("Publish resolution update successful");

    yield put(governanceModuleApi.actions.updatePublishSuccess());
  } catch (e) {
    logger.info("Publish resolution update cancelled" + e);
  }
}

export function* txGovernanceSagas(): Generator<any, any, any> {
  yield takeLatest(
    actions.txTransactions.startPublishResolutionUpdate,
    txStartPublishResolutionUpdate,
  );
}
