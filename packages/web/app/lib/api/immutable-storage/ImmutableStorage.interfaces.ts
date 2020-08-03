import { YupTS } from "@neufund/shared-modules";

export interface IImmutableFileId {
  ipfsHash: string;
  mimeType: string;
  placeholders?: { [key: string]: string };
  asPdf: boolean;
}

export const FileDescriptionType = YupTS.string();

export const ImmutableFileDescriptionValidator = FileDescriptionType.toYup();
