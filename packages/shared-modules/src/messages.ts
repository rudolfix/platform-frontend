import { DeepReadonly } from "@neufund/shared-utils";

import { EKycRequestStatusTranslation, KycFlowMessage } from "./modules/kyc/module";
import { ETxHistoryMessage } from "./modules/tx-history/module";

export type TTranslatedString = string;

export type SharedTranslatedMessageType =
  | ETxHistoryMessage
  | KycFlowMessage
  | EKycRequestStatusTranslation;

export const createMessage = (
  messageType: SharedTranslatedMessageType,
  messageData?: any,
): TMessage => ({
  messageType,
  messageData,
});

export type TMessage = DeepReadonly<{
  messageType: SharedTranslatedMessageType;
  messageData?: any;
}>;
