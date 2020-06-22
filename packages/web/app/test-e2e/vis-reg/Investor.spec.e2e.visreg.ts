import { assertInvestorProposal, goToInvestorProposal } from "../investor/governance/utils";
import {
  goToDashboard,
  goToPortfolio,
  goToProfile,
  goToWallet,
  loginFixtureAccount,
  tid,
} from "../utils";

describe("Investor", () => {
  beforeEach(() => {});

  it("should render dashboard", () => {
    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP_2");

    goToDashboard();

    cy.get(tid("my-neu-widget-neumark-balance.large-value")).should("exist");

    cy.awaitedScreenshot(tid("dashboard-eto-list"));
  });

  it("should render portfolio", () => {
    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP_2");

    goToPortfolio();

    cy.get(tid("token-details-NOMERA-view-profile")).should("exist");

    cy.screenshot();
  });

  it("should render wallet", () => {
    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP_2");

    goToWallet();
    cy.awaitedScreenshot(tid("transactions-history"));
  });

  it("should render profile", () => {
    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP_2");

    goToProfile();

    cy.screenshot();
  });

  it("should render voting proposal", () => {
    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP");

    const PROPOSAL_ID = "0x6400a3523bc839d6bad3232d118c4234d9ef6b2408ca6afcadcbff728f06d220";

    goToInvestorProposal(PROPOSAL_ID);

    assertInvestorProposal();

    cy.screenshot();
  });
});
