import { SignerRejectConfirmationError, SignerTimeoutError } from "./Web3Manager";

//TODO add translations
export function mapSignerErrorToErrorMessage(e: Error): string | undefined {
  if (e instanceof SignerRejectConfirmationError) {
    return "Message signing was rejected";
  }

  if (e instanceof SignerTimeoutError) {
    return "Oops! Looks like the request timed out. Please try again.";
  }

  return undefined;
}
