import * as YupTS from "../yup-ts";
import { etoDocumentType } from "./eto/EtoFileApi.interfaces";

export interface ImmutableFileId {
  ipfsHash: string;
  mimeType: string;
  name: etoDocumentType;
  placeholders?: { [key: string]: string };
  asPdf: boolean;
}

export const FileDescriptionType = YupTS.string();

export const ImmutableFileDescriptionValidator = FileDescriptionType.toYup();

export const immutableDocumentName: { [key: string]: string } = {
  company_token_holder_agreement: "Company Token Holder Agreement",
  investment_and_shareholder_agreement: "Investment and Shareholder Agreement",
  pamphlet_template_en: "Pamphlet Template en",
  prospectus_template_en: "prospectus Template en",
  reservation_and_acquisition_agreement: "Reservation and Acquisition Agreement",
  termsheet_template: "Termsheet Template",
};
