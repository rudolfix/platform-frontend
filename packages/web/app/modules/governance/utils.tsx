import { invariant, isInEnum } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EGovernanceAction } from "./types";

export const governanceActionToLabel = (
  resolutionAction: EGovernanceAction,
  companyName: string,
) => {
  switch (resolutionAction) {
    case EGovernanceAction.ANNUAL_GENERAL_MEETING:
      return (
        <FormattedMessage id="governance.action.annual-general-meeting" values={{ companyName }} />
      );

    case EGovernanceAction.COMPANY_NONE:
      return <FormattedMessage id="governance.action.company-none" values={{ companyName }} />;

    case EGovernanceAction.NONE:
      return <FormattedMessage id="governance.action.shareholder-resolution" />;

    case EGovernanceAction.REGISTER_OFFER:
      return <FormattedMessage id="governance.action.register-offer" />;

    default:
      invariant(resolutionAction, "Unknown resolutionAction action");
      return "";
  }
};

export const convertGovernanceActionNumberToEnum = (action: BigNumber): EGovernanceAction => {
  const actionAsNumber = action.toNumber();
  invariant(isInEnum(EGovernanceAction, actionAsNumber), "Invalid governance action");
  return actionAsNumber;
};
