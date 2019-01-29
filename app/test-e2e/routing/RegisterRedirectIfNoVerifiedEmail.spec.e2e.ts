import { registerWithLightWallet } from "../utils";
import { DEFAULT_PASSWORD, generateRandomEmailAddress } from "../utils/userHelpers";
import { kycRoutes } from "../../components/kyc/routes";
import { appRoutes } from "../../components/appRoutes";

describe("Lock some routes if registration is not complete", () => {
  it("should redirect from locked routes to Profile if user's email is not verified yet", () => {
    registerWithLightWallet(generateRandomEmailAddress(), DEFAULT_PASSWORD, false, true);

    cy.visit(kycRoutes.start);
    cy.url().should("contain", appRoutes.profile);

    cy.visit(appRoutes.documents);
    cy.url().should("contain", appRoutes.profile);
  });
});
