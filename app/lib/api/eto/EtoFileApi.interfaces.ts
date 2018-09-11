import { EtoStateToCamelcase } from "./EtoApi.interfaces";

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

export type etoDocumentType =
  | "reservation_and_acquisition_agreement"
  | "company_token_holder_agreement"
  | "investment_and_shareholder_agreement"
  | "prospectus_template"
  | "pamphlet_template"
  | "termsheet_template"
  | "approved_prospectus"
  | "approved_pamphlet"
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

type IComplextFileInfo = "canDeleteInStates" | "canUploadInStates";

type ISimpleFileInfo = "requiredTemplates" | "uploadableDocuments";

export interface IEtoFiles {
  etoTemplates: TEtoDocumentTemplates;
  uploadedDocuments: TEtoDocumentTemplates;
  stateInfo?: { [key in ISimpleFileInfo]: etoDocumentType[] } &
    { [key in IComplextFileInfo]: { [key in EtoStateToCamelcase]: etoDocumentType[] } };
}

export type TEtoDocumentTemplates = { [key: string]: IEtoDocument };

export const immutableDocumentName: { [key: string]: string } = {
  company_token_holder_agreement: "Company Token Holder Agreement",
  investment_and_shareholder_agreement: "Investment and Shareholder Agreement",
  pamphlet_template: "Pamphlet Template",
  prospectus_template: "Prospectus Template",
  reservation_and_acquisition_agreement: "Reservation and Acquisition Agreement",
  termsheet_template: "Termsheet Template",
  approved_prospectus: "Approved Prospectus",
  approved_pamphlet: "Approved Pamphlet",
  signed_investment_and_shareholder_agreement: "Signed Investment and Shareholder Agreement",
};
