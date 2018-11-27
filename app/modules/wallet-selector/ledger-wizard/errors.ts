import {LedgerLockedError} from "../../../lib/web3/LedgerWallet";
import {LedgerErrorMessage} from '../../../components/translatedMessages/errorMessages'

export function mapLedgerErrorToErrorMessage(error: Error): LedgerErrorMessage {
  if (error instanceof LedgerLockedError) {
    return LedgerErrorMessage.LEDGER_LOCKED;
  }
  return LedgerErrorMessage.GENERIC_ERROR;
}

