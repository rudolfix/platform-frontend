import { fork, neuTakeLatest, TActionFromCreator } from "@neufund/sagas";
import { Alert } from "react-native";

import { notificationUIActions } from "./actions";

// TODO: Remove when we get rid of saga `deps` in neu wrappers
type TGlobalDependencies = unknown;

function* showInfo(
  _: TGlobalDependencies,
  action:
    | TActionFromCreator<typeof notificationUIActions, typeof notificationUIActions.showInfo>
    | TActionFromCreator<typeof notificationUIActions, typeof notificationUIActions.showError>,
): Generator<unknown, void> {
  Alert.alert(action.payload.message);
}

export function* notificationUISaga(): Generator<unknown, void> {
  yield fork(
    neuTakeLatest,
    [notificationUIActions.showInfo, notificationUIActions.showError],
    showInfo,
  );
}
