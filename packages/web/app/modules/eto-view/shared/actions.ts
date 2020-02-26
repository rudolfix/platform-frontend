import { createActionFactory } from "@neufund/shared";

import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { etoViewInvestorActions } from "../investor/actions";
import { EtoViewIssuerActions } from "../issuer/actions";
import { EtoViewNomineeActions } from "../nominee/actions";
import { etoViewNotAuthActions } from "../notAuth/actions";
import { TReadyEtoViewData } from "./types";

export const etoViewActions = {
  setEtoViewData: createActionFactory("ETO_VIEW_SET_ETO_DATA", (etoData: TReadyEtoViewData) => ({
    etoData,
  })),
  setEtoData: createActionFactory(
    "ETO_SET_ETO_DATA",
    (etoData: TEtoWithCompanyAndContractReadonly) => ({
      etoData,
    }),
  ),
  reloadEtoView: createActionFactory("ETO_RELOAD_ETO_DATA"),
  watchEtoView: createActionFactory(
    "ETO_VIEW_WATCH_ETO",
    (eto: TEtoWithCompanyAndContractReadonly) => ({ eto }),
  ),
  setEtoError: createActionFactory("ETO_VIEW_SET_ETO_ERROR"),
  ...etoViewNotAuthActions,
  ...etoViewInvestorActions,
  ...EtoViewIssuerActions,
  ...EtoViewNomineeActions,
};
