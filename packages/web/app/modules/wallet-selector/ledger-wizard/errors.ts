import { LedgerErrorMessage } from "../../../components/translatedMessages/messages";
import { createMessage, TMessage } from "../../../components/translatedMessages/utils";
import {
  LedgerContractsDisabledError,
  LedgerLockedError,
  LedgerNotSupportedVersionError,
} from "../../../lib/web3/ledger-wallet/errors";
import { LedgerUserCancelledError } from "./../../../lib/web3/ledger-wallet/errors";
import { SignerRejectConfirmationError } from "./../../../lib/web3/Web3Manager/Web3Manager";

export function mapLedgerErrorToErrorMessage(error: Error): TMessage {
  let messageType = LedgerErrorMessage.GENERIC_ERROR;

  if (error instanceof LedgerLockedError) {
    messageType = LedgerErrorMessage.LEDGER_LOCKED;
  } else if (error instanceof LedgerUserCancelledError) {
    messageType = LedgerErrorMessage.USER_CANCELLED;
  } else if (error instanceof LedgerContractsDisabledError) {
    messageType = LedgerErrorMessage.CONTRACT_DISABLED;
  } else if (error instanceof LedgerNotSupportedVersionError) {
    messageType = LedgerErrorMessage.NOT_SUPPORTED;
  } else if (error instanceof SignerRejectConfirmationError) {
    messageType = LedgerErrorMessage.USER_CANCELLED;
  }
  return createMessage(messageType);
}
