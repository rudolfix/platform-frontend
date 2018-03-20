import { effects } from "redux-saga";
import { fork, select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { TAction } from "../actions";
import { selectUser } from "../auth/reducer";
import { updateUser } from "../auth/sagas";
import { neuTakeEvery } from "../sagas";
import { actions } from "./../actions";

export function* addNewEmail(
  { notificationCenter: NotificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "SETTINGS_ADD_NEW_EMAIL") return;
  const email = action.payload.email;
  const user = yield select((s: IAppState) => selectUser(s.auth));
  try {
    yield effects.call(updateUser, { ...user, new_email: email });
    yield effects.put(actions.routing.goToSettings());
    NotificationCenter.info("New Email added");
  } catch {
    NotificationCenter.error("Failed to change email");
    throw new Error();
  }
}

export const settingsSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "SETTINGS_ADD_NEW_EMAIL", addNewEmail);
};
