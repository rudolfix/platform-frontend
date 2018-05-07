import { LedgerLockedError } from "../../../lib/web3/LedgerWallet";

export function mapLedgerErrorToErrorMessage(error: Error): string {
  if (error instanceof LedgerLockedError) {
    return "Nano Ledger S is locked";
  }
  return "Nano Ledger S is not available";
}
//TODO: add translation
