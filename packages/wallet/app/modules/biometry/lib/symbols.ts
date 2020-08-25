import { createLibSymbol } from "@neufund/shared-modules";

import { Biometry } from "./Biometry";

export const privateSymbols = {
  biometry: createLibSymbol<Biometry>("biometry"),
};
