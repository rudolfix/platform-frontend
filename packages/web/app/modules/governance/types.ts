import * as Yup from "yup";

export enum EGovernanceControllerState {
  SETUP = 0,
  OFFERING = 1,
  FUNDED = 2,
  CLOSING = 3,
  CLOSED = 4,
  MIGRATING = 5,
  MIGRATED = 6,
}

export enum EGovernanceAction {
  NONE = 0,
  REGISTER_OFFER = 1,
  AMEND_GOVERNANCE = 2,
  RESTRICTED_NONE = 3,
  COMPANY_NONE = 4,
  THR_NONE = 5,
  STOP_TOKEN = 6,
  CONTINUE_TOKEN = 7,
  CLOSE_TOKEN = 8,
  ORDINARY_PAYOUT = 9,
  EXTRAORDINARY_PAYOUT = 10,
  CHANGE_TOKEN_CONTROLLER = 11,
  ISSUE_TOKENS_FOR_EXISTING_SHARES = 12,
  ISSUE_SHARES_FOR_EXISTING_TOKENS = 13,
  CHANGE_NOMINEE = 14,
  ANTI_DILUTION_PROTECTION = 15,
  ESTABLISH_AUTHORIZED_CAPITAL = 16,
  ESTABLISH_ESOP = 17,
  CONVERT_ESOP = 18,
  CHANGE_OF_CONTROL = 19,
  DISSOLVE_COMPANY = 20,
  TAG_ALONG = 21,
  ANNUAL_GENERAL_MEETING = 22,
  ANNUAL_SHARES_AND_VALUATION = 23,
  AMEND_VALUATION = 24,
  CANCEL_RESOLUTION = 25,
}

export type TResolution = {
  action: EGovernanceAction;
  id: string;
  draft: boolean;
  startedAt: Date;
}

export type TResolutionUpdate = {
  title: string;
}

export const GovernanceUpdateSchema = Yup.object().shape({
  updateTitle: Yup.string().required(),
});
