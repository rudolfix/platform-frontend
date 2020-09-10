import { EEtoState } from "./lib/http/eto-api/EtoApi.interfaces";

export class InvalidETOStateError extends Error {
  constructor(actual: EEtoState, expected: EEtoState) {
    super(`Invalid ETO state. ${expected} was expected instead of ${actual}`);
  }
}
