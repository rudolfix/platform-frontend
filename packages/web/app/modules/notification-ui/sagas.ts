import { fork, neuTakeLatest, TActionFromCreator } from "@neufund/sagas";
import { notificationUIActions } from "@neufund/shared-modules";
import { showErrorToast, showInfoToast } from "../../components/shared/Toast";
import { getMessageTranslation } from "../../components/translatedMessages/messages";

import { TGlobalDependencies } from "../../di/setupBindings";

function* showInfo(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof notificationUIActions, typeof notificationUIActions.showInfo>,
): Generator<unknown, void> {
  const {message, options} = action.payload;
  showInfoToast(getMessageTranslation(message), options);
}

function* showError(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof notificationUIActions, typeof notificationUIActions.showError>,
): Generator<unknown, void> {
  const {message, options} = action.payload;
  showErrorToast(getMessageTranslation(message), options);
}

export function* webNotificationUISaga(): Generator<unknown, void> {
  yield fork(neuTakeLatest, notificationUIActions.showInfo, showInfo);
  yield fork(neuTakeLatest, notificationUIActions.showError, showError);
}
