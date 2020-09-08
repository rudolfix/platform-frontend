import { fork, put, select, take } from "@neufund/sagas";
import { ETxType, walletApi } from "@neufund/shared-modules";
import { ECurrency } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../actions";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import { selectEthereumAddress } from "../../../web3/selectors";
import { makeEthereumAddressChecksummed } from "../../../web3/utils";
import { txSendSaga } from "../../sender/sagas";
import { selectStandardGasPriceWithOverHead } from "../../sender/selectors";
import { UserCannotUnlockFunds, UserMissingNeumarks } from "./errors";
import {
  selectUserHasEnoughNeumarkToUnlockEtherWallet,
  selectUserHasEnoughNeumarkToUnlockEuroWallet,
} from "./selectors";

function* generateUnlockEtherTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const canUserUnlock = yield select(walletApi.selectors.selectEtherLockedWalletHasFunds);
  if (!canUserUnlock) {
    throw new UserCannotUnlockFunds();
  }

  const doesUserHaveEnoughNeumarks = yield select(selectUserHasEnoughNeumarkToUnlockEtherWallet);
  if (!doesUserHaveEnoughNeumarks) {
    throw new UserMissingNeumarks();
  }

  const userAddress = yield select(selectEthereumAddress);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const neumarksDue = yield select(walletApi.selectors.selectEtherLockedNeumarksDue);

  const txData = contractsService.neumark.rawWeb3Contract.approveAndCall[
    "address,uint256,bytes"
  ].getData(contractsService.etherLock.address, new BigNumber(neumarksDue), "");

  const txInitialDetails = {
    to: makeEthereumAddressChecksummed(contractsService.neumark.address),
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

function* generateUnlockEuroTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const canUserUnlock = yield select(walletApi.selectors.selectEuroLockedWalletHasFunds);
  if (!canUserUnlock) {
    throw new UserCannotUnlockFunds();
  }

  const doesUserHaveEnoughNeumarks = yield select(selectUserHasEnoughNeumarkToUnlockEuroWallet);
  if (!doesUserHaveEnoughNeumarks) {
    throw new UserMissingNeumarks();
  }

  const userAddress = yield select(selectEthereumAddress);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const euroNeumarksDue = yield select(walletApi.selectors.selectEuroLockedNeumarksDue);

  const txData = contractsService.neumark.rawWeb3Contract.approveAndCall[
    "address,uint256,bytes"
  ].getData(contractsService.euroLock.address, new BigNumber(euroNeumarksDue), "");

  const txInitialDetails = {
    to: makeEthereumAddressChecksummed(contractsService.neumark.address),
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

function* unlockEtherFundsTransactionGenerator(_: TGlobalDependencies): any {
  const generatedTxDetails: ITxData = yield neuCall(generateUnlockEtherTransaction);
  const neumarksDue = yield select(walletApi.selectors.selectEtherLockedNeumarksDue);
  const lockedWalletBalance: string = yield select(walletApi.selectors.selectLockedEtherBalance);
  const lockedWalletUnlockDate: string = yield select(
    walletApi.selectors.selectLockedEtherUnlockDate,
  );

  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary<ETxType.UNLOCK_FUNDS>({
      currencyType: ECurrency.ETH,
      neumarksDue,
      lockedWalletUnlockDate,
      lockedWalletBalance,
    }),
  );
}

function* unlockEuroFundsTransactionGenerator(_: TGlobalDependencies): any {
  const generatedTxDetails: ITxData = yield neuCall(generateUnlockEuroTransaction);
  const neumarksDue = yield select(walletApi.selectors.selectEuroLockedNeumarksDue);
  const lockedWalletBalance: string = yield select(
    walletApi.selectors.selectLockedEuroTokenBalance,
  );
  const lockedWalletUnlockDate: string = yield select(
    walletApi.selectors.selectLockedEuroUnlockDate,
  );

  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary<ETxType.UNLOCK_FUNDS>({
      currencyType: ECurrency.EUR_TOKEN,
      neumarksDue,
      lockedWalletUnlockDate,
      lockedWalletBalance,
    }),
  );
}

function* unlockEtherFunds({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    const walletData = yield select(walletApi.selectors.selectWalletData);

    if (!walletData) {
      // If accesses via a direct link wait for the wallet to load
      yield take(walletApi.actions.saveWalletData);
    }
    yield txSendSaga({
      type: ETxType.UNLOCK_FUNDS,
      transactionFlowGenerator: unlockEtherFundsTransactionGenerator,
    });
    yield put(walletApi.actions.loadWalletData());
    logger.info("Unlock Ether Funds successful");
  } catch (e) {
    logger.info("Unlock Ether Funds cancelled", e);
  }
}

function* unlockEuroFunds({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    const walletData = yield select(walletApi.selectors.selectWalletData);

    if (!walletData) {
      // If accesses via a direct link wait for the wallet to load
      yield take(walletApi.actions.saveWalletData);
    }
    yield txSendSaga({
      type: ETxType.UNLOCK_FUNDS,
      transactionFlowGenerator: unlockEuroFundsTransactionGenerator,
    });
    yield put(walletApi.actions.loadWalletData());
    logger.info("Unlock Euro Funds successful");
  } catch (e) {
    logger.info("Unlock Euro Funds cancelled", e);
  }
}

export const txUnlockWalletSagas = function*(): Generator<any, any, any> {
  yield fork(neuTakeLatest, actions.txTransactions.startUnlockEtherFunds, unlockEtherFunds);
  yield fork(neuTakeLatest, actions.txTransactions.startUnlockEuroFunds, unlockEuroFunds);
};
