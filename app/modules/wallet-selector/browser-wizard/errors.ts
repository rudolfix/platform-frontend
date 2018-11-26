import {
  BrowserWalletAccountApprovalPendingError,
  BrowserWalletAccountApprovalRejectedError,
  BrowserWalletLockedError,
  BrowserWalletMismatchedNetworkError,
  BrowserWalletMissingError,
} from "../../../lib/web3/BrowserWallet";
import {BrowserWalletErrorMessage} from "../../../config/errorMessages";


export function mapBrowserWalletErrorToErrorMessage(e: Error): BrowserWalletErrorMessage {
  if (e instanceof BrowserWalletLockedError) {
    return BrowserWalletErrorMessage.BROWSER_WALLET_IS_LOCKED;
  }
  if (e instanceof BrowserWalletMismatchedNetworkError) {
    return BrowserWalletErrorMessage.BROWSER_WALLET_CONNECTED_TO_WRONG_NETWORK;
  }
  if (e instanceof BrowserWalletMissingError) {
    return BrowserWalletErrorMessage.BROWSER_WALLET_NOT_ENABLED;
  }
  if (e instanceof BrowserWalletAccountApprovalRejectedError) {
    return BrowserWalletErrorMessage.BROWSER_WALLET_ACCOUNT_APPROVAL_REJECTED;
  }
  if (e instanceof BrowserWalletAccountApprovalPendingError) {
    return BrowserWalletErrorMessage.BROWSER_WALLET_ACCOUNT_APPROVAL_PENDING;
  }

  return BrowserWalletErrorMessage.BROWSER_WALLET_GENERIC_ERROR;
}
