import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { actions } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";
import { ILockedWallet, IWalletStateData } from "../wallet/reducer";
import { loadWalletDataAsync } from "../wallet/sagas";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { TAction } from "./../actions";
import { selectIcbmWalletEthAddress } from "./selectors";

class IcbmWalletError extends Error {}

class NoIcbmWalletError extends IcbmWalletError {}
class SameUserError extends IcbmWalletError {}

function hasIcbmWallet(lockedWallet: ILockedWallet): boolean {
  return lockedWallet.unlockDate !== "0";
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
    const userAddress = yield select((s: IAppState) => selectEthereumAddressWithChecksum(s.web3));
    if (userAddress === ethAddress) throw new SameUserError();

    const migrationWalletData: IWalletStateData = yield neuCall(loadWalletDataAsync, ethAddress);
    const isIcbmUser = hasIcbmWallet(migrationWalletData.etherTokenICBMLockedWallet);
    if (!isIcbmUser) throw new NoIcbmWalletError();

    yield put(
      actions.icbmWalletBalanceModal.loadIcbmWalletData(
        migrationWalletData.etherTokenICBMLockedWallet,
      ),
    );
    yield put(actions.icbmWalletBalanceModal.showIcbmWalletBalanceModal());
  } catch (e) {
    logger.error("Error: ", e);
    // todo: all texts to text resources
    if (e instanceof NoIcbmWalletError)
      return notificationCenter.error("ICBM Wallet not found for given Ethereum address");
    if (e instanceof SameUserError) return notificationCenter.error("This is your current address");
    // Default Error
    return notificationCenter.error("Error while loading wallet data");
  }
}

export function* icbmWalletGetDataSagas(): any {
  yield fork(neuTakeEvery, "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA", loadIcbmWalletDataSaga);
}
