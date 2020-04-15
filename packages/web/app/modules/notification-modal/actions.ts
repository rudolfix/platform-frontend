import { createActionFactory } from "@neufund/shared-utils";

import { TMessage } from "../../components/translatedMessages/utils";

export enum ENotificationModalType {
  ERROR = "error",
  INFO = "info",
}

interface INotificationModalActionPayload {
  type: ENotificationModalType;
  message: TMessage;
}

export const notificationModalActions = {
  notify: createActionFactory("NOTIFY", ({ type, message }: INotificationModalActionPayload) => ({
    type,
    message,
  })),
};
