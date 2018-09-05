import * as promiseAll from "promise-all";

import { fork, put, select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { ICBMLockedAccount } from "../../lib/contracts/ICBMLockedAccount";
import { LockedAccount } from "../../lib/contracts/LockedAccount";
import { IAppState } from "../../store";
import { EthereumAddress } from "../../types";
import { actions } from "../actions";
import { numericValuesToString } from "../contracts/utils";
import { neuCall, neuTakeEvery } from "../sagas";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { ILockedWallet, IWalletStateData } from "./reducer";

function* loadWalletDataSaga({ logger }: TGlobalDependencies): any {
  try {
    const ethAddress = yield select((s: IAppState) => selectEthereumAddressWithChecksum(s.web3));

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
    ...{
      euroTokenICBMLockedWallet: await loadICBMWallet(ethAddress, contractsService.icbmEuroLock),
      etherTokenICBMLockedWallet: await loadICBMWallet(ethAddress, contractsService.icbmEtherLock),
      euroTokenLockedWallet: await loadICBMWallet(ethAddress, contractsService.euroLock),
      etherTokenLockedWallet: await loadICBMWallet(ethAddress, contractsService.etherLock),
    },
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
}
