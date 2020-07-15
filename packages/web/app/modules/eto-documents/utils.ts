import { EEtoDocumentType, TEtoDocumentTemplates } from "@neufund/shared-modules";
import { curry } from "lodash/fp";

const getDocumentByType = curry(
  (documents: TEtoDocumentTemplates, documentType: EEtoDocumentType) =>
    Object.values(documents).find(document => document.documentType === documentType),
);

export { getDocumentByType };
