import { createLibSymbol } from "../../utils";
import { EtoApi } from "./lib/http/eto-api/EtoApi";
import { EtoFileApi } from "./lib/http/eto-api/EtoFileApi";
import { EtoNomineeApi } from "./lib/http/eto-api/EtoNomineeApi";
import { EtoProductApi } from "./lib/http/eto-api/EtoProductApi";

export const symbols = {
  etoApi: createLibSymbol<EtoApi>("eto-api"),
  etoFileApi: createLibSymbol<EtoFileApi>("eto-file-api"),
  etoProductApi: createLibSymbol<EtoProductApi>("eto-product-api"),
  etoNomineeApi: createLibSymbol<EtoNomineeApi>("eto-nominee-api"),
};
