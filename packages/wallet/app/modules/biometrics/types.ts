export enum EBiometricsType {
  IOSFaceID = "IOSFaceID",
  IOSTouchID = "IOSTouchID",
}

export const BIOMETRICS_NONE = "none" as const;

export type TBiometricsNone = typeof BIOMETRICS_NONE;
