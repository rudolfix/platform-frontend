import { fork, neuTakeLatest, TActionFromCreator } from "@neufund/sagas";
import { notificationUIActions } from "@neufund/shared-modules";

import { TGlobalDependencies } from "../../di/setupBindings";

function* showInfo(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof notificationUIActions, typeof notificationUIActions.showInfo>,
): Generator<unknown, void> {}

function* showError(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof notificationUIActions, typeof notificationUIActions.showError>,
): Generator<unknown, void> {}

export function* notificationUISaga(): Generator<unknown, void> {
  yield fork(neuTakeLatest, notificationUIActions.showInfo, showInfo);
  yield fork(neuTakeLatest, notificationUIActions.showError, showError);
}
