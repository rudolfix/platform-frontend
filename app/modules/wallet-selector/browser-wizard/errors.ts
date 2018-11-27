import {
  BrowserWalletAccountApprovalPendingError,
  BrowserWalletAccountApprovalRejectedError,
  BrowserWalletLockedError,
  BrowserWalletMismatchedNetworkError,
  BrowserWalletMissingError,
} from "../../../lib/web3/BrowserWallet";
import {BrowserWalletErrorMessage, ErrorWithData} from '../../../components/translatedMessages/errorMessages'



export function mapBrowserWalletErrorToErrorMessage(e: Error): BrowserWalletErrorMessage {
  if (e instanceof BrowserWalletLockedError) {
    return  BrowserWalletErrorMessage.WALLET_IS_LOCKED;
  }
  if (e instanceof BrowserWalletMismatchedNetworkError) {
    return BrowserWalletErrorMessage.WALLET_CONNECTED_TO_WRONG_NETWORK;
  }
  if (e instanceof BrowserWalletMissingError) {
    return BrowserWalletErrorMessage.WALLET_NOT_ENABLED;
  }
  if (e instanceof BrowserWalletAccountApprovalRejectedError) {
    return BrowserWalletErrorMessage.ACCOUNT_APPROVAL_REJECTED;
  }
  if (e instanceof BrowserWalletAccountApprovalPendingError) {
    return BrowserWalletErrorMessage.ACCOUNT_APPROVAL_PENDING;
  }

  return BrowserWalletErrorMessage.GENERIC_ERROR;
}

