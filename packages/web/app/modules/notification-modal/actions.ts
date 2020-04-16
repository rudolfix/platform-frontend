import { createActionFactory } from "@neufund/shared-utils";

import { TMessage } from "../../components/translatedMessages/utils";

export enum ENotificationModalType {
  ERROR = "error",
  INFO = "info",
}

interface IBla {
  type: ENotificationModalType;
  message: TMessage;
}

export const notificationModalActions = {
  notify: createActionFactory("NOTIFY", ({ type, message }: IBla) => ({
    type,
    message,
  })),
};
