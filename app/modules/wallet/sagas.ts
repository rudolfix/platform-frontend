import { addHexPrefix } from "ethereumjs-util";
import { BigNumber } from "bignumber.js";
import * as promiseAll from "promise-all";
import { fork, put, select, take } from "redux-saga/effects";
import * as Web3Utils from "web3-utils";
import {
  selectICBMLockedEuroTokenBalance,
  selectIsEuroUpgradeTargetSet,
  selectIsEtherUpgradeTargetSet,
} from "./selectors";

import { TGlobalDependencies } from "../../di/setupBindings";
import { ICBMLockedAccount } from "../../lib/contracts/ICBMLockedAccount";
import { LockedAccount } from "../../lib/contracts/LockedAccount";
import { ITxData } from "../../lib/web3/Web3Manager";
import { IAppState } from "../../store";
import { EthereumAddress } from "../../types";
import { actions } from "../actions";
import { numericValuesToString } from "../contracts/utils";
import { selectGasPrice } from "../gas/selectors";
import { neuCall, neuTakeEvery } from "../sagas";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { ILockedWallet, IWalletStateData } from "./reducer";
import { selectICBMLockedEtherBalance } from "./selectors";

export function* generateEuroUpgradeTransaction({ contractsService }: TGlobalDependencies): any {
  debugger;
  const userAddress = yield select((state: IAppState) =>
    selectEthereumAddressWithChecksum(state.web3),
  );
  const gasPrice = yield select((state: IAppState) => selectGasPrice(state.gas));
  const migrationTarget = yield select((state: IAppState) =>
    selectIsEuroUpgradeTargetSet(state.wallet),
  );
  const euroBalance = yield select((state: IAppState) =>
    selectICBMLockedEuroTokenBalance(state.wallet),
  );

  if (!migrationTarget || new BigNumber(euroBalance).equals(0)) {
    throw new Error();
    // TODO: Add no balance error
  }
  const txInput = contractsService.icbmEuroLock.migrateTx().getData();

  const txDetails: ITxData = {
    to: contractsService.icbmEuroLock.address,
    from: userAddress,
    data: txInput,
    value: addHexPrefix("0"),
    gasPrice: gasPrice.standard,
  };
  const estimatedGas = yield contractsService.icbmEuroLock.migrateTx().estimateGas(txDetails);
  txDetails.gas = addHexPrefix(new BigNumber(estimatedGas).toString(16));

  yield put(actions.txSender.txSenderAcceptDraft(txDetails));
}

export function* generateEtherUpgradeTransaction({ contractsService }: TGlobalDependencies): any {
  debugger;
  const userAddress = yield select((state: IAppState) =>
    selectEthereumAddressWithChecksum(state.web3),
  );
  const gasPrice = yield select((state: IAppState) => selectGasPrice(state.gas));
  const migrationTarget = yield select((state: IAppState) =>
    selectIsEtherUpgradeTargetSet(state.wallet),
  );
  const etherBalance = yield select((state: IAppState) =>
    selectICBMLockedEtherBalance(state.wallet),
  );

  if (!migrationTarget || new BigNumber(etherBalance).equals(0)) {
    throw new Error();
    // TODO: Add no balance error
  }
  const txInput = contractsService.icbmEtherLock.migrateTx().getData();

  const txDetails: ITxData = {
    to: contractsService.icbmEtherLock.address,
    from: userAddress,
    data: txInput,
    value: addHexPrefix("0"),
    gasPrice,
  };

  const estimateGas = yield contractsService.icbmEtherLock.migrateTx().estimateGas(txDetails);
  txDetails.gas = addHexPrefix(new BigNumber(estimateGas).toString(16));

  yield put(actions.txSender.txSenderAcceptDraft(txDetails));
}

export const txUpgradeSagasWatcher = function*(): Iterator<any> {};

function* loadWalletDataSaga({ logger }: TGlobalDependencies): any {
  try {
    const ethAddress = yield select((s: IAppState) => selectEthereumAddressWithChecksum(s.web3));
    yield put(actions.gas.gasApiEnsureLoading());
    yield take("GAS_API_LOADED");

    const state: IWalletStateData = yield neuCall(loadWalletDataAsync, ethAddress);
    yield put(actions.wallet.loadWalletData(state));
    logger.info("Wallet Loaded");
  } catch (e) {
    yield put(actions.wallet.loadWalletDataError("Error while loading wallet data."));
    logger.error("Error while loading wallet data: ", e);
  }
}

async function loadICBMWallet(
  ethAddress: EthereumAddress,
  lockedAccount?: ICBMLockedAccount | LockedAccount,
): Promise<ILockedWallet> {
  if (lockedAccount) {
    const balance = await lockedAccount.balanceOf(ethAddress);
    return numericValuesToString({
      LockedBalance: balance[0],
      neumarksDue: balance[1],
      unlockDate: balance[2],
    });
  } else {
    // todo: may be removed when contracts deployed on production
    return {
      LockedBalance: "0",
      neumarksDue: "0",
      unlockDate: "0",
    };
  }
}

export async function loadWalletDataAsync(
  { contractsService, web3Manager }: TGlobalDependencies,
  ethAddress: EthereumAddress,
): Promise<IWalletStateData> {
  return {
    ...(await promiseAll({
      euroTokenICBMLockedWallet: loadICBMWallet(ethAddress, contractsService.icbmEuroLock),
      etherTokenICBMLockedWallet: loadICBMWallet(ethAddress, contractsService.icbmEtherLock),
      euroTokenLockedWallet: loadICBMWallet(ethAddress, contractsService.euroLock),
      etherTokenLockedWallet: loadICBMWallet(ethAddress, contractsService.etherLock),
      etherTokenUpgradeTarget: contractsService.icbmEtherLock.currentMigrationTarget,
      euroTokenUpgradeTarget: contractsService.icbmEuroLock.currentMigrationTarget,
    })),
    ...numericValuesToString(
      await promiseAll({
        etherTokenBalance: contractsService.etherToken.balanceOf(ethAddress),
        euroTokenBalance: contractsService.euroToken.balanceOf(ethAddress),
        etherBalance: web3Manager.internalWeb3Adapter.getBalance(ethAddress),
        neuBalance: contractsService.neumark.balanceOf(ethAddress),
      }),
    ),
  };
}

export function* walletSagas(): any {
  yield fork(neuTakeEvery, "WALLET_START_LOADING", loadWalletDataSaga);
  yield fork(neuTakeEvery, "GENERATE_ETHER_WALLET_UPGRADE_TX", generateEtherUpgradeTransaction);
  yield fork(neuTakeEvery, "GENERATE_EURO_WALLET_UPGRADE_TX", generateEuroUpgradeTransaction);
}
