import { appRoutes } from "../appRoutes";

const parentRoutePath = appRoutes.kyc;

export const kycRoutes = {
  start: parentRoutePath + "/start",
  success: parentRoutePath + "/success",

  // private
  individualStart: parentRoutePath + "/personal/start",
  individualAddress: parentRoutePath + "/personal/address",
  financialDisclosure: parentRoutePath + "/personal/financial-disclosure",
  individualUpload: parentRoutePath + "/personal/upload",
  individualDocumentVerification: parentRoutePath + "/personal/document-verification",

  // company
  legalRepresentative: parentRoutePath + "/business/legal-representative",
  businessData: parentRoutePath + "/business/data",
  managingDirectors: parentRoutePath + "/business/managing-directors",
  beneficialOwners: parentRoutePath + "/business/beneficial-owners",
  businessUpload: parentRoutePath + "/business/upload",

  // other
  pending: parentRoutePath + "/pending",
  rejected: parentRoutePath + "/rejected",
};
