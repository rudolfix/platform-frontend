import { AppActionTypes, AppReducer } from "../../store";
import { notificationActions } from "./actions";

export enum NotificationType {
  INFO = "info",
  WARNING = "warning",
}

export interface INotification {
  id: number;
  type: NotificationType;
  text: string;
  onClickAction: AppActionTypes;
  actionLinkText?: string;
}

export interface INotificationsState {
  id: number;
  notifications: Array<INotification>;
}

export const notificationsInitState: INotificationsState = {
  id: 0,
  notifications: [],
};

export const notificationsReducer: AppReducer<INotificationsState> = (
  state = notificationsInitState,
  action,
): INotificationsState => {
  switch (action.type) {
    case "NOTIFICATIONS_ADD": {
      const pNotification = action.payload.notification;

      const newState = {
        id: state.id + 1,
        notifications: Array.from(state.notifications),
      } ;

      newState.notifications.push({
        id: newState.id,
        type: pNotification.type,
        actionLinkText: pNotification.actionLinkText,
        text: pNotification.text,
        onClickAction: pNotification.onClickAction
          ? pNotification.onClickAction
          : notificationActions.notificationRemove(newState.id),
      });
      return newState;
    }
    case "NOTIFICATIONS_REMOVE":
      const notificationsFiltered = state.notifications.filter(
        notification => notification.id !== action.payload.id,
      );
      return {
        ...state,
        notifications: notificationsFiltered,
      };
  }
  return state;
};
