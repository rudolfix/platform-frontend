import { appRoutes } from "../AppRouter";

const parentRoutePath = appRoutes.kyc;

export const kycRoutes = {
  start: parentRoutePath + "/start",

  // private
  personalStart: parentRoutePath + "/personal/start",
  personalInstantId: parentRoutePath + "/personal/instantid",
  personalManualVerification: parentRoutePath + "/personal/manual/start",
  personalIDUpload: parentRoutePath + "/personal/manual/id",
  personalDone: parentRoutePath + "/personal/done",

  // company
  companyStart: parentRoutePath + "/company/start",
  companyDone: parentRoutePath + "/company/done",

  // other
  pending: parentRoutePath + "/pending",
  rejected: parentRoutePath + "/rejected",
};
