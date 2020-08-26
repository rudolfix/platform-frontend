import { InvariantError } from "./invariant";

export class FormInputError extends Error {}
export class DataUnavailableError extends Error {}
export class StateNotAllowedError extends Error {}
export class GovernanceNotSetUpError extends Error {}
export class GovernanceIncompatibleError extends Error {
  constructor(public etoId: string) {
    super();
  }
}
export class DevError extends Error {
  constructor(message: string) {
    super(`[Dev Only] ${message}`);
  }
}

const assertError = (error: unknown): asserts error is Error => {
  if (!(error instanceof Error)) {
    throw new InvariantError(
      `Invalid error type. Received ${typeof error}, expected instance of Error`,
    );
  }
};

export { assertError };
