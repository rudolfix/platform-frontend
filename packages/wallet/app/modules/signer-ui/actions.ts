import { createActionFactory } from "@neufund/shared-utils";

import { ESignerType, TSignerRequestData, TSignerResponseData } from "./types";

export const SIGN_ACTION_TYPE = "SIGNER_UI_SIGN";
export const SIGNED_ACTION_TYPE = "SIGNER_UI_SIGNED";

export const signerUIActions = {
  sign: <T extends ESignerType>(signerType: T, data: TSignerRequestData[T]) =>
    createActionFactory(SIGN_ACTION_TYPE, (signerType: T, data: TSignerRequestData[T]) => ({
      signerType,
      data,
    }))(signerType, data),
  signed: <T extends ESignerType>(signerType: T, data: TSignerResponseData[T]) =>
    createActionFactory(SIGNED_ACTION_TYPE, (signerType: T, data: TSignerResponseData[T]) => ({
      signerType,
      data,
    }))(signerType, data),
  approved: createActionFactory("SIGNER_UI_APPROVED"),
  denied: createActionFactory("SIGNER_UI_DENIED"),
};
