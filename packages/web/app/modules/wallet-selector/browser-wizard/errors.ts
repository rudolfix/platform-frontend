import { BrowserWalletErrorMessage, SignInUserErrorMessage, } from "../../../components/translatedMessages/messages";
import { createMessage, TMessage } from "../../../components/translatedMessages/utils";
import {
  BrowserWalletAccountApprovalPendingError,
  BrowserWalletAccountApprovalRejectedError, BrowserWalletConfirmationRejectedError,
  BrowserWalletLockedError,
  BrowserWalletMismatchedNetworkError,
  BrowserWalletMissingError, BrowserWalletUnknownError,
} from "../../../lib/web3/browser-wallet/BrowserWallet";
import { mapSignInErrors } from "../../auth/user/sagas";

export function mapBrowserWalletErrorToErrorMessage(e: Error): TMessage {
  let messageType: BrowserWalletErrorMessage | SignInUserErrorMessage;

  if (e instanceof BrowserWalletLockedError) {
    messageType = BrowserWalletErrorMessage.WALLET_IS_LOCKED;
  } else if (e instanceof BrowserWalletMismatchedNetworkError) {
    messageType = BrowserWalletErrorMessage.WALLET_CONNECTED_TO_WRONG_NETWORK;
  } else if (e instanceof BrowserWalletMissingError) {
    messageType = BrowserWalletErrorMessage.WALLET_NOT_ENABLED;
  } else if (e instanceof BrowserWalletAccountApprovalRejectedError) {
    messageType = BrowserWalletErrorMessage.ACCOUNT_APPROVAL_REJECTED;
  } else if (e instanceof BrowserWalletAccountApprovalPendingError) {
    messageType = BrowserWalletErrorMessage.ACCOUNT_APPROVAL_PENDING;
  } else if (e instanceof BrowserWalletConfirmationRejectedError) {
    messageType = BrowserWalletErrorMessage.GENERIC_ERROR;
  } else if (e instanceof BrowserWalletUnknownError) {
    messageType = BrowserWalletErrorMessage.GENERIC_ERROR;
  } else {
    messageType = mapSignInErrors(e)
  }

  return createMessage(messageType);
}
