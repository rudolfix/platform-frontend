import { etoFixtureAddressByName, goToPortfolio, tid } from "../../utils/index";
import { loginFixtureAccount } from "../../utils/userHelpers";

describe("Reserved assets", () => {
  it("should show reserved asserts in portfolio #portfolio #p3", () => {
    const etoId = etoFixtureAddressByName("ETOInPayoutState");

    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP");

    goToPortfolio();

    cy.get(tid(`portfolio-my-assets-token-${etoId}`)).should("exist");
  });
});
