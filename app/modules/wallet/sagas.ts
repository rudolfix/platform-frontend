import promiseAll = require("promise-all");

import BigNumber from "bignumber.js";
import { fork, put, select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { EthereumAddress } from "../../types";
import { actions } from "../actions";
import { valuesToString } from "../contracts/utils";
import { neuCall, neuTakeEvery } from "../sagas";
import { selectEthereumAddress } from "../web3/reducer";
import { IWalletStateData } from "./reducer";
import { selectIsLoaded } from "./selectors";

function* loadWalletDataSaga({ logger }: TGlobalDependencies): any {
  try {
    const isLoaded = yield select((s: IAppState) => selectIsLoaded(s.wallet));
    if (isLoaded) return;

    const ethAddress = yield select((s: IAppState) => selectEthereumAddress(s.web3));

    const state: IWalletStateData = yield neuCall(loadWalletDataAsync, ethAddress);

    yield put(actions.wallet.loadWalletData(state));
  } catch (e) {
    yield put(actions.wallet.loadWalletDataError("Error while loading wallet data."));
    logger.error("Error while loading wallet data: ", e);
  }
}

async function loadWalletDataAsync(
  { contractsService, web3Manager }: TGlobalDependencies,
  ethAddress: EthereumAddress,
): Promise<IWalletStateData> {
  return valuesToString(
    await promiseAll({
      euroTokenBalance: contractsService.euroTokenContract.balanceOf(ethAddress),
      euroTokenLockedBalance: Promise.resolve(new BigNumber("0")),
      euroTokenICBMLockedBalance: contractsService.euroLock.balanceOf(ethAddress),

      etherBalance: web3Manager.internalWeb3Adapter.getBalance(ethAddress),
      etherTokenBalance: contractsService.etherTokenContract.balanceOf(ethAddress),
      etherTokenLockedBalance: Promise.resolve(new BigNumber("0")),
      etherICBMLockedBalance: contractsService.etherLock.balanceOf(ethAddress),

      neuBalance: contractsService.neumarkContract.balanceOf(ethAddress),

      etherPriceEur: Promise.resolve(new BigNumber("499")),
      neuPriceEur: Promise.resolve(new BigNumber("0.500901")),
    }),
  );
}

export function* walletSagas(): any {
  yield fork(neuTakeEvery, "WALLET_START_LOADING", loadWalletDataSaga);
}
