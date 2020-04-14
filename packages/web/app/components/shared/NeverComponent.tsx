import { StateNotAllowedError } from "@neufund/shared-utils";

export const shouldNeverHappen = (reason: string) => (): never => {
  throw new StateNotAllowedError(reason);
};
