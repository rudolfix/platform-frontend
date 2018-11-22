import { SignerRejectConfirmationError, SignerTimeoutError } from "./Web3Manager";

export function mapSignerErrorToErrorMessage(e: Error): string | undefined {
  if (e instanceof SignerRejectConfirmationError) {
    return "Message signing was rejected";
  }

  if (e instanceof SignerTimeoutError) {
    return "There is timeout when signing your message";
  }

  return undefined;
}
