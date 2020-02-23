import { appRoutes } from "../../components/appRoutes";
import { kycRoutes } from "../../components/kyc/routes";
import {
  DEFAULT_PASSWORD,
  generateRandomEmailAddress,
  registerWithLightWalletIssuer,
} from "../utils/index";

describe("Lock some routes if registration is not complete", () => {
  it("should redirect from locked routes to Profile if user's email is not verified yet", () => {
    registerWithLightWalletIssuer(generateRandomEmailAddress(), DEFAULT_PASSWORD);

    cy.visit(kycRoutes.start);
    cy.url().should("contain", appRoutes.profile);

    cy.visit(appRoutes.documents);
    cy.url().should("contain", appRoutes.profile);
  });
});
