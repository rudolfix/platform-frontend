import { LedgerLockedError } from "../../../lib/web3/LedgerWallet";

export function mapLedgerErrorToErrorMessage(error: Error): string {
  if (error instanceof LedgerLockedError) {
    return "Ledger Nano S is locked";
  }
  return "Ledger Nano S is not available";
}
//TODO: add translation
