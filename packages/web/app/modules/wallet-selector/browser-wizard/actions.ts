import { createActionFactory } from "@neufund/shared";

import { TMessage } from "../../../components/translatedMessages/utils";

export const browserWizardActions = {
  tryConnectingWithBrowserWallet: createActionFactory("BROWSER_WALLET_TRY_CONNECTING"),
  browserWalletConnectionError: createActionFactory(
    "BROWSER_WALLET_CONNECTION_ERROR",
    (errorMsg: TMessage) => ({ errorMsg }),
  ),
  browserWalletAccountApprovalRejectedError: createActionFactory(
    "BROWSER_WALLET_APPROVAL_REJECTED",
  ),
};
