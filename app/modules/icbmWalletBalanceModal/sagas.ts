import * as promiseAll from "promise-all";
import { fork, put, select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { EthereumAddress } from "../../types";
import { actions } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";
import { IIcbmWalletBalanceModal } from "./reducer";
import { selectIcbmWalletEthAddress } from "./selectors";

function* loadIcbmWalletDataSaga({ logger, notificationCenter }: TGlobalDependencies): any {
  const ethAddress = yield select((s: IAppState) =>
    selectIcbmWalletEthAddress(s.icbmWalletBalanceModal),
  );

  try {
    const state: IIcbmWalletBalanceModal = yield neuCall(loadIcbmWalletDataAsync, ethAddress);

    yield put(actions.icbmWalletBalanceModal.loadIcbmWalletData(state));
  } catch (e) {
    logger.error("Error while loading wallet data: ", e);

    notificationCenter.error("Error while loading wallet data");
  }
}

async function loadIcbmWalletDataAsync(
  { contractsService }: TGlobalDependencies,
  ethAddress: EthereumAddress,
): Promise<{ lockedBalance: string[] }> {
  return await promiseAll({
    lockedBalance: contractsService.etherLock
      .balanceOf(ethAddress)
      .then(b => b.map(n => n.toString())),
  });
}

export function* icbmWalletGetDataSagas(): any {
  yield fork(neuTakeEvery, "ICBM_WALLET_BALANCE_MODAL_START_LOADING", loadIcbmWalletDataSaga);
}
