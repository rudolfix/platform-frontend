import { BrowserWalletError } from "../../lib/web3/BrowserWallet";
import { mapSignerErrorToErrorMessage } from "../../lib/web3/errors";
import { LedgerError } from "../../lib/web3/LedgerWallet";
import { LightWalletError } from "../../lib/web3/LightWallet";
import { SignerError } from "../../lib/web3/Web3Manager";
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
  if (error instanceof SignerError) {
    return mapSignerErrorToErrorMessage(error);
  }
  return "Unknown error";
}
