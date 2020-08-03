import { goToDashboard, loginFixtureAccount, tid } from "../../utils";

describe("Governance", () => {
  it("Governance tab should be visible #p1", () => {
    loginFixtureAccount("ISSUER_PAYOUT", {}).then(() => {
      goToDashboard(false);
      cy.get(tid("dashboard-governance-tab")).should("exist");
    });
  });

  it("Governance tab should not be visible #p1", () => {
    loginFixtureAccount("ISSUER_SETUP_NO_ST", {}).then(() => {
      goToDashboard(false);
      cy.get(tid("dashboard-governance-tab"))
        .invoke("attr", "aria-disabled")
        .should("equal", "true");
    });
  });

  it("Governance tab should not be visible for investor #p2", () => {
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC", {}).then(() => {
      goToDashboard(false);
      cy.get(tid("dashboard-governance-tab")).should("not.exist");
    });
  });
});
