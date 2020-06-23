import { createActionFactory } from "@neufund/shared-utils";

export const instantIdIdNowActions = {
  /*
   * External actions
   */
  startIdNowRequest: createActionFactory("KYC_ID_NOW_START_REQUEST"),

  /*
   * Internal actions
   */
  setIdNowRedirectUrl: createActionFactory(
    "KYC_ID_NOW_SET_REDIRECT_URL",
    (redirectUrl: string) => ({ redirectUrl }),
  ),
};
