type fileStates = "canReplace" | "locked" | "readOnly";

export interface IEtoSingleFile {
  url: string;
  status: fileStates;
}

export interface IEtoLinkFile {
  url: string;
  name: string;
}

export interface IEtoGeneratedFile {
  url: string;
  title: string;
}

export type TEtoUploadFile =
  | "pamphlet"
  | "termSheet"
  | "infoBlatt"
  | "bafinProspectus"
  | "signedAgreement";

export interface IEtoFiles {
  links: IEtoLinkFile[];
  generatedDocuments: IEtoGeneratedFile[];
  uploadedDocuments: {
    pamphlet?: {
      url: string;
      status: string;
      file?: File;
    };
    termSheet?: {
      url: string;
      status: string;
      file?: File;
    };
    infoBlatt?: {
      url: string;
      status: string;
      file?: File;
    };
    bafinProspectus?: {
      url: string;
      status: string;
      file?: File;
    };
    signedAgreement?: {
      url: string;
      status: string;
      file?: File;
    };
  };
}
