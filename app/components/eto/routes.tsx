import { appRoutes } from "../AppRouter";

const parentRoutePath = appRoutes.eto;
const registrationPath = parentRoutePath + "/registration";

export const etoRoutes = {
  // registration flow
  companyInformation: registrationPath + "/company-information",
  legalRepresentative: registrationPath + "/legal-representative",
  teamAndInvestors: registrationPath + "/team-and-investors",
  marketInformation: registrationPath + "/market-information",
  productAndVision: registrationPath + "/product-and-vision",
  etoTerms: registrationPath + "/eto-terms",
};
