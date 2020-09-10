import { createLibSymbol } from "../../../utils";
import { EtoApi } from "./http/eto-api/EtoApi";
import { EtoFileApi } from "./http/eto-api/EtoFileApi";
import { EtoNomineeApi } from "./http/eto-api/EtoNomineeApi";
import { EtoProductApi } from "./http/eto-api/EtoProductApi";
import { EtoTokensApi } from "./http/eto-api/EtoTokensApi";

export const symbols = {
  etoApi: createLibSymbol<EtoApi>("eto-api"),
  etoTokensApi: createLibSymbol<EtoTokensApi>("eto-tokens-api"),
  etoFileApi: createLibSymbol<EtoFileApi>("eto-file-api"),
  etoProductApi: createLibSymbol<EtoProductApi>("eto-product-api"),
  etoNomineeApi: createLibSymbol<EtoNomineeApi>("eto-nominee-api"),
};
