import { EtoState } from "./EtoApi.interfaces";
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

export type etoDocumentType =
  | "reservation_and_acquisition_agreement"
  | "company_token_holder_agreement"
  | "investment_and_shareholder_agreement"
  | "prospectus_template"
  | "pamphlet_template"
  | "termsheet_template"
  | "bafin_approved_prospectus"
  | "bafin_approved_pamphlet"
  | "signed_investment_and_shareholder_agreement"
  | "other";

type etoFormType = "document" | "template";
export interface IEtoDocument {
  documentType: etoDocumentType;
  form: etoFormType;
  ipfsHash: string;
  mimeType: string;
  name: string;
  placeholders?: { [key: string]: string };
}

type IFileInfo =
  | "canDeleteInStates"
  | "canUploadInStates"
  | "requiredTemplates"
  | "uploadable_documents";

export interface IEtoFiles {
  etoTemplates: { [key: string]: IEtoDocument };
  uploadedDocuments: { [key: string]: IEtoDocument };
  stateInfo?: { [key in IFileInfo]: { [key in EtoState]: etoDocumentType[] } };
}

export type TEtoDocumentTemplates = { [key: string]: IEtoDocument };
