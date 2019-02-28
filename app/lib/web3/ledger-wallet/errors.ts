export class LedgerError extends Error {}
export class LedgerConfirmationRejectedError extends LedgerError {}
export class LedgerContractsDisabledError extends LedgerError {}
export class LedgerLockedError extends LedgerError {}
export class LedgerNotAvailableError extends LedgerError {}
export class LedgerNotSupportedVersionError extends LedgerError {}
export class LedgerInvalidDerivationPathError extends LedgerError {}
export class LedgerTimeoutError extends LedgerError {}
export class LedgerUnknownError extends LedgerError {}

export function parseLedgerError(error: any): LedgerError {
    if (error.message !== undefined && error.message === "Invalid status 6985") {
      return new LedgerConfirmationRejectedError();
    } else if (error.message !== undefined && error.message === "Invalid status 6a80") {
      return new LedgerContractsDisabledError();
    } else if (
      error.message === "Sign failed" &&
      error.metaData !== undefined &&
      error.metaData.type === "TIMEOUT"
    ) {
      return new LedgerTimeoutError();
    } else {
      return new LedgerUnknownError();
    }
  }
  