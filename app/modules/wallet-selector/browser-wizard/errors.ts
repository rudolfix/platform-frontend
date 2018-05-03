import {
  BrowserWalletLockedError,
  BrowserWalletMismatchedNetworkError,
  BrowserWalletMissingError,
} from "../../../lib/web3/BrowserWallet";
import { ethereumNetworkIdToNetworkName } from "../../web3/utils";

export function mapBrowserWalletErrorToErrorMessage(e: Error): string {
  if (e instanceof BrowserWalletLockedError) {
    return "Your wallet seems to be locked — we can't access any accounts";
  }
  if (e instanceof BrowserWalletMismatchedNetworkError) {
    return `Your wallet is connected to the wrong network: ${ethereumNetworkIdToNetworkName(
      e.actualNetworkId,
    )}. Please change the network`;
  }
  if (e instanceof BrowserWalletMissingError) {
    return "We did not detect any Web3 wallet";
  }
  return "Web3 wallet not available";
}
//TODO: ADD TRANSLATIONS
