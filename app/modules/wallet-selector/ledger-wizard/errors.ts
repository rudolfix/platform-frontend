import {LedgerLockedError} from "../../../lib/web3/LedgerWallet";
import {LedgerErrorMessage, IMessage} from '../../../components/translatedMessages/messages'

export function mapLedgerErrorToErrorMessage(error: Error): IMessage {
  if (error instanceof LedgerLockedError) {
    return {messageType:LedgerErrorMessage.LEDGER_LOCKED};
  }
  return {messageType:LedgerErrorMessage.GENERIC_ERROR};
}

