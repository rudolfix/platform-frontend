import { createLibSymbol } from "../../../utils";
import { MarketingEmailsApi } from "./MarketingEmailsApi";

export const symbols = {
  marketingEmailsApi: createLibSymbol<MarketingEmailsApi>("marketingEmailsApi"),
};
