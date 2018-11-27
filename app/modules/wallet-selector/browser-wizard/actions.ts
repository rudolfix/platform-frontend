import { createAction, createSimpleAction } from "../../actionsUtils";
import {IMessage} from "../../../components/translatedMessages/messages";

export const browserWizardActions = {
  browserWalletConnectionError: (errorMsg: IMessage) =>
    createAction("BROWSER_WALLET_CONNECTION_ERROR", { errorMsg }),
  browserWalletAccountApprovalRejectedError: () =>
    createSimpleAction("BROWSER_WALLET_APPROVAL_REJECTED"),
  browserWalletResetApprovalRequest: () =>
    createSimpleAction("BROWSER_WALLET_APPROVAL_REQUEST_RESET"),
};
