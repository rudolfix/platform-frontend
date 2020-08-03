import { createLibSymbol } from "../../utils";
import { EtoPledgeApi } from "./lib/http/eto-pledge-api/EtoPledgeApi";

export const symbols = {
  etoPledgeApi: createLibSymbol<EtoPledgeApi>("eto-pledge-api"),
};
