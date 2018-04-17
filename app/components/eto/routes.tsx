import { appRoutes } from "../AppRouter";

const parentRoutePath = appRoutes.eto;
const registrationPath = parentRoutePath + "/registration";

export const etoRoutes = {
  // registration flow
  teamAndInvestors: registrationPath + "/team-and-investors",
  marketInformation: registrationPath + "/market-information",
  productAndVision: registrationPath + "/product-and-vision",
  etoTerms: registrationPath + "/eto-terms",
};
