import { createActionFactory } from "@neufund/shared";
import { ESignerType, TSignerRequestData, TSignerResponseData } from "./types";

export const signerUIActions = {
  sign: createActionFactory(
    "SIGNER_UI_SIGN",
    <T extends ESignerType>(signerType: T, data: TSignerRequestData[T]) => ({
      signerType,
      data,
    }),
  ),
  signed: createActionFactory(
    "SIGNER_UI_SIGNED",
    <T extends ESignerType>(signerType: T, data: TSignerResponseData[T]) => ({
      signerType,
      data,
    }),
  ),
  approved: createActionFactory("SIGNER_UI_APPROVED"),
  denied: createActionFactory("SIGNER_UI_DENIED"),
};
