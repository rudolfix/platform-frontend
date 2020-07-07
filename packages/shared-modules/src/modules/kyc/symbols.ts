import { createLibSymbol } from "../../utils";
import { KycApi } from "./lib/http/kyc-api/KycApi";

export const symbols = {
  kycApi: createLibSymbol<KycApi>("kyc-api"),
};
