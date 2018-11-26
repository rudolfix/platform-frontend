import {
  BrowserWalletAccountApprovalPendingError,
  BrowserWalletAccountApprovalRejectedError,
  BrowserWalletLockedError,
  BrowserWalletMismatchedNetworkError,
  BrowserWalletMissingError,
} from "../../../lib/web3/BrowserWallet";

/**
 * Returns error message or undefined if error is unknown
 */
export function mapBrowserWalletErrorToErrorMessage(e: Error): string | undefined {
  if (e instanceof BrowserWalletLockedError) {
    return "Your wallet seems to be locked — we can't access any accounts";
  }
  if (e instanceof BrowserWalletMismatchedNetworkError) {
    return "Please connect your wallet to the \"Main Ethereum Network\" by selecting from the \"Networks\" drop-down menu in MetaMask.";
  }
  if (e instanceof BrowserWalletMissingError) {
    return "Please check if the MetaMask extension is enabled in your browser. We were unable to detect any wallet.";
  }
  if (e instanceof BrowserWalletAccountApprovalRejectedError) {
    return "Data approval rejected";
  }
  if (e instanceof BrowserWalletAccountApprovalPendingError) {
    return "Please check MetaMask to confirm this action.";
  }

  return undefined;
}
//TODO: ADD TRANSLATIONS
