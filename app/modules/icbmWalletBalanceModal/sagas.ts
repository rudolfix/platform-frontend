import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { actions } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";
import { loadWalletDataAsync } from "../wallet/sagas";
import { TAction } from "./../actions";
import { selectIcbmWalletEthAddress } from "./selectors";

function* loadIcbmWalletDataSaga(
  { logger, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  const ethAddress = yield select((s: IAppState) =>
    selectIcbmWalletEthAddress(s.icbmWalletBalanceModal),
  );
  if (action.type !== "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA") return;
  try {
    const migrationWalletData = yield neuCall(loadWalletDataAsync, ethAddress);
    yield put(actions.icbmWalletBalanceModal.loadIcbmWalletData(migrationWalletData));
  } catch (e) {
    logger.error("Error while loading wallet data: ", e);

    notificationCenter.error("Error while loading wallet data");
  }
}

export function* icbmWalletGetDataSagas(): any {
  yield fork(neuTakeEvery, "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA", loadIcbmWalletDataSaga);
}
