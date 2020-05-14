import { fork, neuTakeLatest, TActionFromCreator } from "@neufund/sagas";
import { notificationUIModuleApi } from "@neufund/shared-modules";
import { Alert } from "react-native";

const actions = notificationUIModuleApi.actions;

// TODO: Remove when we get rid of saga `deps` in neu wrappers
type TGlobalDependencies = unknown;

function* showInfo(
  _: TGlobalDependencies,
  action:
    | TActionFromCreator<typeof actions, typeof actions.showInfo>
    | TActionFromCreator<typeof actions, typeof actions.showError>,
): Generator<unknown, void> {
  Alert.alert(action.payload.message as string);
}

export function* notificationUISaga(): Generator<unknown, void> {
  yield fork(neuTakeLatest, [actions.showInfo, actions.showError], showInfo);
}
