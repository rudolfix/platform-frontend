import { LedgerErrorMessage } from "../../../components/translatedMessages/messages";
import { createMessage, TMessage } from "../../../components/translatedMessages/utils";
import { LedgerLockedError } from "../../../lib/web3/LedgerWallet";

export function mapLedgerErrorToErrorMessage(error: Error): TMessage {
  let messageType = LedgerErrorMessage.GENERIC_ERROR;

  if (error instanceof LedgerLockedError) {
    messageType = LedgerErrorMessage.LEDGER_LOCKED;
  }
  return createMessage(messageType);
}
