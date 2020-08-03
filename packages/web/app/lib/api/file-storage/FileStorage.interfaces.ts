import { TypeOfYTS, YupTS } from "@neufund/shared-modules";

export const FileDescriptionType = YupTS.object({
  type: YupTS.string(),
  url: YupTS.string(),
});

export const FileDescriptionValidator = FileDescriptionType.toYup();

export type TFileDescription = TypeOfYTS<typeof FileDescriptionType>;

export type TFileType = "image";
