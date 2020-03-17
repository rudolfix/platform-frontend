import {
  fork,
  neuCall,
  neuTakeEvery,
  neuTakeLatestUntil,
  put,
  select,
} from "@neufund/sagas";

import { TAppGlobalState } from "../../store";
import { actions } from "../actions";
import { handleSignInUser } from "../auth/user/sagas";
import { loadPreviousWallet } from "../web3/sagas";
import { EWalletType } from "../web3/types";
import { ledgerRegister } from './ledgerConnectAndSign';
import { walletSelectorInitialState } from "./reducer";
import { selectUrlUserType } from "./selectors";
import { EFlowType } from "./types";

export type TBaseUiData = {
  flowType: EFlowType;
  walletType: EWalletType;
  showWalletSelector: boolean;
  rootPath: string;
};

export function* walletSelectorConnect(): Generator<any, any, any> {
  yield put(actions.walletSelector.messageSigning());

  const userType = yield* select((s: TAppGlobalState) => selectUrlUserType(s.router));

  yield neuCall(handleSignInUser, userType);
}

export function* walletSelectorReset(): Generator<any, any, any> {
  yield neuCall(loadPreviousWallet);
}


export function* resetWalletSelectorState(): Generator<any, void, any> {
  yield put(actions.walletSelector.reset());
  yield put(actions.walletSelector.setWalletRegisterData(walletSelectorInitialState));
}

export function* walletSelectorSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.walletSelector.reset, walletSelectorReset);
  yield fork(
    neuTakeLatestUntil,
    actions.walletSelector.registerWithLedger,
    "@@router/LOCATION_CHANGE",
    ledgerRegister,
  );
}
