import { InvariantError } from "./invariant";

export class FormInputError extends Error {}
export class DataUnavailableError extends Error {}
export class StateNotAllowedError extends Error {}

const assertError = (error: unknown): asserts error is Error => {
  if (!(error instanceof Error)) {
    throw new InvariantError(
      `Invalid error type. Received ${typeof error}, expected instance of Error`,
    );
  }
};

export { assertError };
