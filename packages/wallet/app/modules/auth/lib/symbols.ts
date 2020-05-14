import { createLibSymbol } from "@neufund/shared-modules";

import { TJWT } from "./schemas";
import { AppSingleKeyStorage } from "../../storage";

export const symbols = {};

export const privateSymbols = {
  jwtStorage: createLibSymbol<AppSingleKeyStorage<TJWT>>("jwtStorage"),
};
