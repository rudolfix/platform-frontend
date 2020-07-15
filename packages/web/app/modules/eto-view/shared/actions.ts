import { TEtoWithCompanyAndContractReadonly } from "@neufund/shared-modules";
import { createActionFactory } from "@neufund/shared-utils";

import { etoViewInvestorActions } from "../investor/actions";
import { EtoViewIssuerActions } from "../issuer/actions";
import { EtoViewNomineeActions } from "../nominee/actions";
import { etoViewNotAuthActions } from "../notAuth/actions";
import { TReadyEtoViewData } from "./types";

export const etoViewActions = {
  setEtoViewData: createActionFactory("ETO_VIEW_SET_ETO_DATA", (etoData: TReadyEtoViewData) => ({
    etoData,
  })),
  resetEtoViewData: createActionFactory("ETO_VIEW_RESET_ETO_DATA"),
  setEtoData: createActionFactory(
    "ETO_SET_ETO_DATA",
    (etoData: TEtoWithCompanyAndContractReadonly) => ({
      etoData,
    }),
  ),
  reloadEtoView: createActionFactory("ETO_RELOAD_ETO_DATA"),
  setEtoError: createActionFactory("ETO_VIEW_SET_ETO_ERROR"),
  ...etoViewNotAuthActions,
  ...etoViewInvestorActions,
  ...EtoViewIssuerActions,
  ...EtoViewNomineeActions,
};
