import { effects } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { accessWalletAndRunEffect } from "../accessWallet/sagas";
import { TAction } from "../actions";
import { selectUser } from "../auth/reducer";
import { updateUser } from "../auth/sagas";
import { neuTakeEvery } from "../sagas";
import { actions } from "./../actions";

export function* addNewEmail(
  { notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "SETTINGS_ADD_NEW_EMAIL") return;
  const email = action.payload.email;
  const user = yield select(selectUser);
  try {
    yield effects.call(updateUser, { ...user, new_email: email });
    yield effects.put(actions.routing.goToSettings());
    notificationCenter.info("New Email added");
  } catch {
    notificationCenter.error("Failed to change email");
  }
}

export function* loadSeedOrReturnToSettings(): Iterator<any> {
  // unlock wallet
  try {
    const signEffect = put(actions.web3.fetchSeedFromWallet());
    return yield call(
      accessWalletAndRunEffect,
      signEffect,
      "Access seed",
      "Please confirm to access your seed.",
    );
  } catch {
    yield put(actions.routing.goToSettings());
  }
}

export const settingsSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "SETTINGS_ADD_NEW_EMAIL", addNewEmail);
  yield fork(neuTakeEvery, "LOAD_SEED_OR_RETURN_TO_SETTINGS", loadSeedOrReturnToSettings);
};
