import {
  BrowserWalletAccountApprovalPendingError,
  BrowserWalletAccountApprovalRejectedError,
  BrowserWalletLockedError,
  BrowserWalletMismatchedNetworkError,
  BrowserWalletMissingError,
} from "../../../lib/web3/BrowserWallet";
import {BrowserWalletErrorMessage, ErrorWithData} from '../../../components/translatedMessages/messages'



export function mapBrowserWalletErrorToErrorMessage(e: Error): ErrorWithData {
  if (e instanceof BrowserWalletLockedError) {
    return  { messageType: BrowserWalletErrorMessage.WALLET_IS_LOCKED};
  }
  if (e instanceof BrowserWalletMismatchedNetworkError) {
    return  { messageType: BrowserWalletErrorMessage.WALLET_CONNECTED_TO_WRONG_NETWORK};
  }
  if (e instanceof BrowserWalletMissingError) {
    return  { messageType: BrowserWalletErrorMessage.WALLET_NOT_ENABLED};
  }
  if (e instanceof BrowserWalletAccountApprovalRejectedError) {
    return  { messageType: BrowserWalletErrorMessage.ACCOUNT_APPROVAL_REJECTED};
  }
  if (e instanceof BrowserWalletAccountApprovalPendingError) {
    return  { messageType: BrowserWalletErrorMessage.ACCOUNT_APPROVAL_PENDING};
  }

  return  { messageType: BrowserWalletErrorMessage.GENERIC_ERROR};
}

