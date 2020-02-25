import { StateNotAllowedError } from "../../../../shared/src/utils/errors";

export const shouldNeverHappen = (reason: string) => (): never => {
  throw new StateNotAllowedError(reason);
};
