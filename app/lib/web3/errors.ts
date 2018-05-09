import { SignerRejectConfirmationError } from "./Web3Manager";

export function mapSignerErrorToErrorMessage(e: Error): string {
  if (e instanceof SignerRejectConfirmationError) {
    return "Message signing was rejected";
  }

  return "Unknown error";
}
