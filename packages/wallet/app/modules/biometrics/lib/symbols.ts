import { createLibSymbol } from "@neufund/shared-modules";

import { Biometrics } from "./Biometrics";

export const privateSymbols = {
  biometrics: createLibSymbol<Biometrics>("biometrics"),
};
