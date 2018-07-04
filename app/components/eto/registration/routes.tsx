import { appRoutes } from "../../appRoutes";

const parentRoute = appRoutes.etoRegister;

export const etoRegisterRoutes = {
  companyInformation: parentRoute + "/company-information",
  legalInformation: parentRoute + "/legal-information",
  keyIndividuals: parentRoute + "/key-individuals",
  productVision: parentRoute + "/product-vision",
  etoTerms: parentRoute + "/eto-terms",
  etoMedia: parentRoute + "/eto-media",
};
