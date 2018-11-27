import {LedgerLockedError} from "../../../lib/web3/LedgerWallet";
import {LedgerErrorMessage, ErrorWithData} from '../../../components/translatedMessages/errorMessages'

export function mapLedgerErrorToErrorMessage(error: Error): ErrorWithData {
  if (error instanceof LedgerLockedError) {
    return {messageType:LedgerErrorMessage.LEDGER_LOCKED};
  }
  return {messageType:LedgerErrorMessage.GENERIC_ERROR};
}

