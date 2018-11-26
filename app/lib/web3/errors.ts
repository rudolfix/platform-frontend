import {SignerRejectConfirmationError, SignerTimeoutError} from "./Web3Manager";
import {SignerErrorMessage} from "../../config/errorMessages";

export function mapSignerErrorToErrorMessage(e: Error): SignerErrorMessage {
  if (e instanceof SignerRejectConfirmationError) {
    return SignerErrorMessage.SIGNER_REJECTED_CONFIRMATION;
  }

  if (e instanceof SignerTimeoutError) {
    return SignerErrorMessage.SIGNER_TIMEOUT;
  }

  return SignerErrorMessage.SIGNER_GENERIC_ERROR;
}
