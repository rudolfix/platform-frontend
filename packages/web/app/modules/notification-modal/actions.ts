import { createActionFactory } from "@neufund/shared";

import { TMessage } from "../../components/translatedMessages/utils";

export enum ENotificationModalType {
  ERROR = "error",
  INFO = "info",
}

interface INotificationData {
  type: ENotificationModalType;
  message: TMessage;
}

export const notificationModalActions = {
  notify: createActionFactory("NOTIFY", ({ type, message }: INotificationData) => ({
    type,
    message,
  })),
};
