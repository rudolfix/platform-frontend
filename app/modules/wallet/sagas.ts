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

export async function loadWalletDataAsync(
  { contractsService, web3Manager }: TGlobalDependencies,
  ethAddress: EthereumAddress,
): Promise<IWalletStateData> {
  return {
    ...(await promiseAll({
      euroTokenLockedWallet: contractsService.euroLock.balanceOf(ethAddress).then(b =>
        numericValuesToString({
          ICBMLockedBalance: b[0],
          neumarksDue: b[1],
          unlockDate: b[2],
        }),
      ),
      etherTokenLockedWallet: contractsService.etherLock.balanceOf(ethAddress).then(b =>
        numericValuesToString({
          ICBMLockedBalance: b[0],
          neumarksDue: b[1],
          unlockDate: b[2],
        }),
      ),
    })),
    // This needs to be seperated
    ...numericValuesToString(
      await promiseAll({
        etherTokenBalance: contractsService.etherTokenContract.balanceOf(ethAddress),
        euroTokenBalance: contractsService.euroTokenContract.balanceOf(ethAddress),
        euroTokenLockedBalance: Promise.resolve(new BigNumber("0")),

        etherTokenLockedBalance: Promise.resolve(new BigNumber("0")),

        etherBalance: web3Manager.internalWeb3Adapter.getBalance(ethAddress),
        neuBalance: contractsService.neumarkContract.balanceOf(ethAddress),
      }),
    ),
  };
}

export function* walletSagas(): any {
  yield fork(neuTakeEvery, "WALLET_START_LOADING", loadWalletDataSaga);
}
