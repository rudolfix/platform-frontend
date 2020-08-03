import * as Yup from "yup";

export enum EGovernanceControllerState {
  SETUP,
  OFFERING,
  FUNDED,
  CLOSING,
  CLOSED,
  MIGRATING,
  MIGRATED,
}

export enum EGovernanceAction {
  NONE,
  REGISTER_OFFER,
  AMEND_GOVERNANCE,
  RESTRICTED_NONE,
  COMPANY_NONE,
  THR_NONE,
  STOP_TOKEN,
  CONTINUE_TOKEN,
  CLOSE_TOKEN,
  ORDINARY_PAYOUT,
  EXTRAORDINARY_PAYOUT,
  CHANGE_TOKEN_CONTROLLER,
  ISSUE_TOKENS_FOR_EXISTING_SHARES,
  ISSUE_SHARES_FOR_EXISTING_TOKENS,
  CHANGE_NOMINEE,
  ANTI_DILUTION_PROTECTION,
  ESTABLISH_AUTHORIZED_CAPITAL,
  ESTABLISH_ESOP,
  CONVERT_ESOP,
  CHANGE_OF_CONTROL,
  DISSOLVE_COMPANY,
  TAG_ALONG,
  ANNUAL_GENERAL_MEETING,
  ANNUAL_SHARES_AND_VALUATION,
  AMEND_VALUATION,
  CANCEL_RESOLUTION,
}

export interface IResolution {
  action: EGovernanceAction;
  id: string;
  draft: boolean;
  startedAt: Date;
}

export interface IResolutionUpdate {
  title: string;
}

export const GovernanceUpdateSchema = Yup.object().shape({
  title: Yup.string().required(),
});
