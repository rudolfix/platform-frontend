import { fork, put, select } from "@neufund/sagas";
import { walletApi } from "@neufund/shared-modules";
import { EthereumAddress } from "@neufund/shared-utils";
import { addHexPrefix } from "ethereumjs-util";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ETxType, ITxData } from "../../../../lib/web3/types";
import { actions, TAction } from "../../../actions";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import { selectEthereumAddress } from "../../../web3/selectors";
import { ITxSendParams, txSendSaga } from "../../sender/sagas";
import { selectStandardGasPriceWithOverHead } from "../../sender/selectors";
import { ETokenType } from "../../types";

function* generateEuroUpgradeTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const userAddress = yield select(selectEthereumAddress);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const migrationTarget = yield select(walletApi.selectors.selectIsEuroUpgradeTargetSet);

  if (!migrationTarget) {
    throw new Error();
    // TODO: Add shouldn't hit migration target
  }

  const txData = contractsService.icbmEuroLock.migrateTx().getData();

  const txInitialDetails = {
    to: contractsService.icbmEuroLock.address,
    from: userAddress,
    data: txData,
    value: addHexPrefix("0"),
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };
  return txDetails;
}

function* generateEtherUpgradeTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const userAddress: EthereumAddress = yield select(selectEthereumAddress);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const migrationTarget: boolean = yield select(walletApi.selectors.selectIsEtherUpgradeTargetSet);

  if (!migrationTarget) {
    throw new Error();
    // TODO: Add no balance error
  }
  const txInput = contractsService.icbmEtherLock.migrateTx().getData();

  const txInitialDetails = {
    to: contractsService.icbmEtherLock.address,
    from: userAddress,
    data: txInput,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };

  return txDetails;
}

function* upgradeTransactionFlow(_: TGlobalDependencies, tokenType: ETokenType): any {
  const transactionGenerator =
    tokenType === ETokenType.ETHER
      ? generateEtherUpgradeTransaction
      : generateEuroUpgradeTransaction;
  const generatedTxDetails: ITxData = yield neuCall(transactionGenerator);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary<ETxType.UPGRADE>({
      tokenType,
    }),
  );
}

function* upgradeSaga({ logger }: TGlobalDependencies, action: TAction): Generator<any, any, any> {
  try {
    if (action.type !== "TRANSACTIONS_START_UPGRADE") return;

    const tokenType = action.payload;
    const params: ITxSendParams = {
      type: ETxType.UPGRADE,
      transactionFlowGenerator: upgradeTransactionFlow,
      extraParam: tokenType,
    };
    yield txSendSaga(params);
    yield put(actions.txTransactions.upgradeSuccessful(tokenType));
    logger.info("Upgrading successful");
  } catch (e) {
    logger.info("Upgrading cancelled", e);
  }
}

export const txUpgradeSagas = function*(): Generator<any, any, any> {
  yield fork(neuTakeLatest, "TRANSACTIONS_START_UPGRADE", upgradeSaga);
};
