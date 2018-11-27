import {SignerRejectConfirmationError, SignerTimeoutError} from "./Web3Manager";
import {ErrorWithData, SignerErrorMessage} from '../../components/translatedMessages/messages'

export function mapSignerErrorToErrorMessage(e: Error): ErrorWithData {
  if (e instanceof SignerRejectConfirmationError) {
    return {messageType: SignerErrorMessage.CONFIRMATION_REJECTED};
  }

  if (e instanceof SignerTimeoutError) {
    return {messageType: SignerErrorMessage.TIMEOUT};
  }

  return {messageType: SignerErrorMessage.GENERIC_ERROR};
}

