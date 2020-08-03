import { DeepReadonly } from "@neufund/shared-utils";

import { BookbuildingMessage } from "./modules/bookbuilding/module";
import { EtoMessage } from "./modules/eto/module";
import { InvestorPortfolioMessage } from "./modules/investor-portfolio/module";
import { EKycRequestStatusTranslation, KycFlowMessage } from "./modules/kyc/module";
import { ETxHistoryMessage } from "./modules/tx-history/module";

export type TTranslatedString = string;

export type SharedTranslatedMessageType =
  | ETxHistoryMessage
  | KycFlowMessage
  | EtoMessage
  | EKycRequestStatusTranslation
  | BookbuildingMessage
  | InvestorPortfolioMessage;

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
