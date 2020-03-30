import { appRoutes } from "../../../components/appRoutes";
import { kycRoutes } from "../../../components/kyc/routes";
import { NODE_ADDRESS } from "../../config";
import {
  assertDashboard,
  generateRandomEmailAddress,
  goToDashboard,
  registerWithLightWalletIssuer,
} from "../../utils/index";
import { createAndLoginNewUser } from "../../utils/userHelpers";
import { DEFAULT_PASSWORD } from "./../../utils/constants";

describe("Other routing", () => {
  it("should redirect to dashboard for unsupported routes #routing #p3", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      // redirect from root
      cy.visit("/");
      assertDashboard();

      // redirect from unknown url
      cy.visit("/unknown-url");
      assertDashboard();
    });
  });

  it("should redirect from locked routes to Profile if user's email is not verified yet #routing #p3", () => {
    registerWithLightWalletIssuer(generateRandomEmailAddress(), DEFAULT_PASSWORD);

    cy.visit(kycRoutes.start);
    cy.url().should("contain", appRoutes.profile);

    cy.visit(appRoutes.documents);
    cy.url().should("contain", appRoutes.profile);
  });

  it("should batch Ethereum Node RPC Web3 requests #routing #p3", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: NODE_ADDRESS,
    }).as("node");

    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();

      cy.get("@node").should((xhr: any) => {
        expect(xhr.requestBody).to.be.an("array");
      });
    });
  });
});
