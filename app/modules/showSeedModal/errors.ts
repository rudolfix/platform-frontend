import { BrowserWalletError } from "../../lib/web3/BrowserWallet";
import { LedgerError } from "../../lib/web3/LedgerWallet";
import { LightWalletError } from "../../lib/web3/LightWallet";
import { mapBrowserWalletErrorToErrorMessage } from "../wallet-selector/browser-wizard/errors";
import { mapLedgerErrorToErrorMessage } from "../wallet-selector/ledger-wizard/errors";
import { mapLightWalletErrorToErrorMessage } from "../wallet-selector/light-wizard/errors";

export function mapSignMessageErrorToErrorMessage(error: Error): string {
  if (error instanceof BrowserWalletError) {
    return mapBrowserWalletErrorToErrorMessage(error);
  }
  if (error instanceof LedgerError) {
    return mapLedgerErrorToErrorMessage(error);
  }
  if (error instanceof LightWalletError) {
    return mapLightWalletErrorToErrorMessage(error);
  }
  return "Unknown error";
}
