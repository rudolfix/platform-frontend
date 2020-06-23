import { createActionFactory } from "@neufund/shared-utils";

export const instantIdOnfidoActions = {
  /*
   * External actions
   */
  startOnfidoRequest: createActionFactory("KYC_ONFIDO_START_REQUEST"),
  stopOnfidoRequest: createActionFactory("KYC_ONFIDO_STOP_REQUEST"),

  /*
   * Internal actions
   */
  startOnfidoRequestError: createActionFactory(
    "KYC_ONFIDO_START_REQUEST_ERROR",
    (error: Error) => ({ error }),
  ),
};
