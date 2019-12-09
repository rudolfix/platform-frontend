import { fork } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { actions, TActionFromCreator } from "../actions";
import { neuTakeEvery } from "../sagasUtils";
import { ENotificationModalType } from "./actions";

export function* showNotification(
  { notificationCenter }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.notificationModal.notify>,
): Iterator<any> {
  if (action.type !== "NOTIFY") return;

  const { type, message } = action.payload;

  switch (type) {
    case ENotificationModalType.ERROR:
      return notificationCenter.error(message);
    case ENotificationModalType.INFO:
      return notificationCenter.info(message);
  }
}

export function* notificationModalSagas(): Iterator<any> {
  yield fork(neuTakeEvery, actions.notificationModal.notify, showNotification);
}
