import { assertIssuerProposal, goToIssuerProposal } from "../issuer/governance/utils";
import {
  goToDashboard,
  goToEtoDocuments,
  goToEtoPreview,
  goToProfile,
  goToWallet,
  loginFixtureAccount,
  tid,
} from "../utils";

describe("Issuer", () => {
  it("should render dashboard", () => {
    loginFixtureAccount("ISSUER_BLANK_DEMO_HAS_KYC");

    goToDashboard(false);

    cy.awaitedScreenshot(tid("eto-state-preview"));
  });

  it("should render eto page", () => {
    loginFixtureAccount("ISSUER_BLANK_DEMO_HAS_KYC");

    goToEtoPreview();

    cy.awaitedScreenshot(tid("eto-state-preview"));
  });

  it("should render documents", () => {
    loginFixtureAccount("ISSUER_BLANK_DEMO_HAS_KYC");

    goToEtoDocuments();

    cy.awaitedScreenshot(tid("form.name.signed_termsheet"));
  });

  it("should render wallet", () => {
    loginFixtureAccount("ISSUER_BLANK_DEMO_HAS_KYC");

    goToWallet();

    cy.awaitedScreenshot(tid("transactions-history"));
  });

  it("should render profile", () => {
    loginFixtureAccount("ISSUER_BLANK_DEMO_HAS_KYC");

    goToProfile();

    cy.screenshot();
  });

  it("should render voting proposal", () => {
    loginFixtureAccount("ISSUER_PAYOUT");

    const PROPOSAL_ID = "0x6400a3523bc839d6bad3232d118c4234d9ef6b2408ca6afcadcbff728f06d220";

    goToIssuerProposal(PROPOSAL_ID);

    assertIssuerProposal();

    cy.screenshot();
  });
});
