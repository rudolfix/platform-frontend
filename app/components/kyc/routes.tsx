import { appRoutes } from "../AppRouter";

const parentRoutePath = appRoutes.kyc;

export const kycRoutes = {
  start: parentRoutePath + "/start",

  // private
  individualStart: parentRoutePath + "/personal/start",
  individualUpload: parentRoutePath + "/personal/upload",
  individualInstantId: parentRoutePath + "/personal/instant-id",

  // company
  businessStart: parentRoutePath + "/business/start",
  legalRepresentative: parentRoutePath + "/business/legal-representative",
  businessData: parentRoutePath + "/business/data",
  beneficialOwners: parentRoutePath + "/business/beneficial-owners",

  // other
  pending: parentRoutePath + "/pending",
  rejected: parentRoutePath + "/rejected",
};
