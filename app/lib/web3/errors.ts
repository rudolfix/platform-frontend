import {SignerRejectConfirmationError, SignerTimeoutError} from "./Web3Manager";
import {SignerErrorMessage} from '../../components/translatedMessages/errorMessages'

export function mapSignerErrorToErrorMessage(e: Error): SignerErrorMessage {
  if (e instanceof SignerRejectConfirmationError) {
    return SignerErrorMessage.CONFIRMATION_REJECTED;
  }

  if (e instanceof SignerTimeoutError) {
    return SignerErrorMessage.TIMEOUT;
  }

  return SignerErrorMessage.GENERIC_ERROR;
}

