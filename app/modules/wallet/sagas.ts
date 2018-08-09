import * as promiseAll from "promise-all";

import BigNumber from "bignumber.js";
import { fork, put, select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { EthereumAddress } from "../../types";
import { actions } from "../actions";
import { numericValuesToString } from "../contracts/utils";
import { neuCall, neuTakeEvery } from "../sagas";
import { selectEthereumAddress } from "../web3/selectors";
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
  return numericValuesToString(
    await promiseAll({
      euroTokenBalance: contractsService.euroTokenContract.balanceOf(ethAddress),
      euroTokenLockedBalance: Promise.resolve(new BigNumber("0")),
      euroTokenICBMLockedBalance: contractsService.euroLock.balanceOf(ethAddress).then(b => b[0]),

      etherTokenBalance: contractsService.etherTokenContract.balanceOf(ethAddress),
      etherTokenLockedBalance: Promise.resolve(new BigNumber("0")),
      etherTokenICBMLockedBalance: contractsService.etherLock.balanceOf(ethAddress).then(b => b[0]),

      etherBalance: web3Manager.internalWeb3Adapter.getBalance(ethAddress),
      neuBalance: contractsService.neumarkContract.balanceOf(ethAddress),

      etherPriceEur: Promise.resolve(new BigNumber("483.96")), // @todo hardcoded value
      neuPriceEur: Promise.resolve(new BigNumber("0.500901")), // @todo hardcoded value
    }),
  );
}

export function* walletSagas(): any {
  yield fork(neuTakeEvery, "WALLET_START_LOADING", loadWalletDataSaga);
}

function getWalletData (ethAddress: string): any {
  return neuCall(loadWalletDataAsync, ethAddress);
}

export function* walletGetDataSaga(): any {
  yield fork(neuTakeEvery, "WALLET_GET_DATA_FOR_ADDRESS", getWalletData as any);
}