import { ESignerType } from "../../core/lib/eth/types";

/**
 * Constants for jwt permissions
 * @note enum value should be always in sync with the backend one
 */
export enum EJwtPermissions {
  SUBMIT_KYC_PERMISSION = "submit-kyc",
  CHANGE_EMAIL_PERMISSION = "change-email",
  SUBMIT_ETO_PERMISSION = "submit-eto-listing",
  UPLOAD_IMMUTABLE_DOCUMENT = "upload-issuer-immutable-document",
  DO_BOOK_BUILDING = "do-bookbuilding",
  SIGN_TOS = "sign-tos",
  ISSUER_UPDATE_NOMINEE_REQUEST = "update-nominee-request",
  ISSUER_REMOVE_NOMINEE = "issuer-remove-nominee",
}

export type TSignedChallenge = {
  challenge: string;
  signedChallenge: string;
  signerType: ESignerType;
};
