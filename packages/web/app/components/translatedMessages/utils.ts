import { DeepReadonly } from "@neufund/shared-utils";

import { TDataTestId, TTranslatedString } from "../../types";
import { getMessageTranslation, TranslatedMessageType } from "./messages";

export interface IMessageData extends TDataTestId {
  message?: TTranslatedString;
}

export type TMessage = DeepReadonly<{
  messageType: TranslatedMessageType;
  messageData?: IMessageData;
}>;

export const createMessage = (messageType: TranslatedMessageType, messageData?: any): TMessage => ({
  messageType,
  messageData,
});

export const createNotificationMessage = (
  messageType: TranslatedMessageType,
  messageData?: any,
): TTranslatedString => getMessageTranslation(createMessage(messageType, messageData));

export const formatMatchingFieldNames = (messageData: string[]) => {
  if (messageData.length < 2) {
    throw new Error("At least two field names are required");
  } else {
    return messageData.reduce((acc: string, name: string, index: number) => {
      if (acc === "") {
        return `"${name}"`;
      } else {
        return (acc += `${index === messageData.length - 1 ? " and " : ", "}"${name}"`);
      }
    }, "");
  }
};
