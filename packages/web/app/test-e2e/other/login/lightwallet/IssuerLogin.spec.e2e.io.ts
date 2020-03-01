import { assertIssuerDashboard, registerWithLightWalletETO } from "../../../utils/index";

describe("Issuer", () => {
  const password = "strongpassword";

  it("should register issuer with light-wallet @login @p1", () => {
    cy.clearLocalStorage();
    registerWithLightWalletETO("moe-wallet-backup-e2e@test.com", password);

    assertIssuerDashboard();
  });
});
