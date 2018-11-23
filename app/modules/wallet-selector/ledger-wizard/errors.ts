import { LedgerLockedError } from "../../../lib/web3/LedgerWallet";

export function mapLedgerErrorToErrorMessage(error: Error): string {
  if (error instanceof LedgerLockedError) {
    return "Please unlock your Ledger Nano S by entering your PIN code on the device.";
  }
  return "Ledger Nano S is not available";
}
//TODO: add translation
