import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { actions } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";
import { IWalletStateData } from "../wallet/reducer";
import { loadWalletDataAsync } from "../wallet/sagas";
import { selectEthereumAddress } from "../web3/selectors";
import { TAction } from "./../actions";
import { selectIcbmWalletEthAddress } from "./selectors";

class IcbmWalletError extends Error {}

class NoIcbmWalletError extends IcbmWalletError {}
class SameUserError extends IcbmWalletError {}

function checkIcbmWallet(migrationWalletData: IWalletStateData): boolean {
  /* tslint:disable */
  return !(
    migrationWalletData &&
    migrationWalletData.etherTokenLockedWallet &&
    migrationWalletData.etherTokenLockedWallet.unlockDate === "0" &&
    (migrationWalletData &&
      migrationWalletData.euroTokenLockedWallet &&
      migrationWalletData.euroTokenLockedWallet.unlockDate === "0")
  );
  /* tslint:enable */
}

function* loadIcbmWalletDataSaga(
  { logger, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  const ethAddress = yield select((s: IAppState) =>
    selectIcbmWalletEthAddress(s.icbmWalletBalanceModal),
  );
  if (action.type !== "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA") return;
  try {
    const userAddress = yield select((s: IAppState) => selectEthereumAddress(s.web3));
    if (userAddress === ethAddress) throw new SameUserError();

    const migrationWalletData: IWalletStateData = yield neuCall(loadWalletDataAsync, ethAddress);
    const isIcbmUser = checkIcbmWallet(migrationWalletData);
    if (!isIcbmUser) throw new NoIcbmWalletError();

    yield put(actions.icbmWalletBalanceModal.loadIcbmWalletData(migrationWalletData));
    yield put(actions.icbmWalletBalanceModal.showIcbmWalletBalanceModal());
  } catch (e) {
    logger.error("Error: ", e);
    if (e instanceof NoIcbmWalletError)
      return notificationCenter.error("Given address doesn't exist in our database");
    if (e instanceof SameUserError)
      return notificationCenter.error("User can't check their own address");
    // Default Error
    return notificationCenter.error("Error while loading wallet data");
  }
}

export function* icbmWalletGetDataSagas(): any {
  yield fork(neuTakeEvery, "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA", loadIcbmWalletDataSaga);
}
