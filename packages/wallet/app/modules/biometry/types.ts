export enum EBiometryType {
  IOSFaceID = "IOSFaceID",
  IOSTouchID = "IOSTouchID",
}

export const BIOMETRY_NONE = "none" as const;

export type TBiometryNone = typeof BIOMETRY_NONE;
