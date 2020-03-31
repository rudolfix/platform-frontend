import { fork, neuTakeLatest, TActionFromCreator } from "@neufund/sagas";
import { Alert } from "react-native";

import { TGlobalDependencies } from "../../di/setupBindings";
import { notificationUIActions } from "./actions";

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
