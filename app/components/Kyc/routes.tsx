import { appRoutes } from "../AppRouter";

const parentRoutePath = appRoutes.kyc;

export const kycRoutes = {
  start: parentRoutePath + "/start",

  // private
  privateStart: parentRoutePath + "/private/start",
  privateIDNow: parentRoutePath + "/private/idnow",
  privateManualData: parentRoutePath + "/private/manual/data",
  privateManualID: parentRoutePath + "/private/manual/id",

  // company
  companyStart: parentRoutePath + "/company/start",
  companyData: parentRoutePath + "/company/data",

  pending: parentRoutePath + "/pending",
  rejected: parentRoutePath + "/rejected",
};
