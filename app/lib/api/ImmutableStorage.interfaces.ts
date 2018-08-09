import * as YupTS from "../yup-ts";

export interface ImmutableFileId {
  ipfsHash: string;
  mimeType: string;
  name: string;
  placeholders?: { [key: string]: string };
  asPdf: boolean;
}

export const FileDescriptionType = YupTS.string();

export const ImmutableFileDescriptionValidator = FileDescriptionType.toYup();
