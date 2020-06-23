import { createLibSymbol } from "@neufund/shared-modules";

import { OnfidoSDK } from "./lib/onfido/OnfidoSDK";

export const symbols = {
  onfidoSDK: createLibSymbol<OnfidoSDK>("onfido-sdk"),
};
