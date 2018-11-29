import { TranslatedMessageType } from "./messages";

export type TMessage = {
  messageType: TranslatedMessageType;
  messageData?: Object;
};

export const createMessage = (messageType: TranslatedMessageType, messageData?: any): TMessage => ({
  messageType,
  messageData,
});
