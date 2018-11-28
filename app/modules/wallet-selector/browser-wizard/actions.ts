import { TMessage } from "../../../components/translatedMessages/utils";
import { createAction, createSimpleAction } from "../../actionsUtils";

export const browserWizardActions = {
  browserWalletConnectionError: (errorMsg: TMessage) =>
    createAction("BROWSER_WALLET_CONNECTION_ERROR", { errorMsg }),
  browserWalletAccountApprovalRejectedError: () =>
    createSimpleAction("BROWSER_WALLET_APPROVAL_REJECTED"),
  browserWalletResetApprovalRequest: () =>
    createSimpleAction("BROWSER_WALLET_APPROVAL_REQUEST_RESET"),
};
