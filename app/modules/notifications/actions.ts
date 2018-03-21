import { AppActionTypes } from "../../store";
import { createAction } from "../actionsUtils";
import { NotificationType } from "./reducer";

export interface INewNotification {
  type: NotificationType;
  text: string;
  actionLinkText?: string;
  onClickAction?: AppActionTypes;
}

export const notificationActions = {
  notificationAdd: (notification: INewNotification) =>
    createAction("NOTIFICATIONS_ADD", { notification }),

  notificationRemove: (id: number) => createAction("NOTIFICATIONS_REMOVE", { id }),
};
