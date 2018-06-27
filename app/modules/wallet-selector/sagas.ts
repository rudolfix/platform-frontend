import { effects } from "redux-saga";
import { fork } from "redux-saga/effects";
import { neuCall, neuTakeEvery } from "../sagas";
import { loadPreviousWallet } from "../web3/sagas";
import { TUserType } from "./../../lib/api/users/interfaces";
import { IAppState } from "./../../store";
import { selectUrlUserType } from "./selectors";

export function* loadWalletFromUrl(): Iterator<any> {
  const userType: TUserType = yield effects.select((s: IAppState) => selectUrlUserType(s.router));
  yield neuCall(loadPreviousWallet, userType);
}

export function* walletSelectorSagas(): Iterator<any> {
  yield fork(neuTakeEvery, "WALLET_SELECTOR_RESET", loadWalletFromUrl);
}
