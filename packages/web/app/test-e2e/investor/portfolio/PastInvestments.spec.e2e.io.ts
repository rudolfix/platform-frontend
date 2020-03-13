import { etoFixtureAddressByName, goToPortfolio, tid } from "../../utils/index";
import { loginFixtureAccount } from "../../utils/userHelpers";

describe("Past Investments", () => {
  it("should populate on initial view #portfolio #p2", () => {
    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP_2");

    goToPortfolio();

    const etoId = etoFixtureAddressByName("ETOInPayoutState");

    cy.get(tid(`past-investments-${etoId}`)).should("exist");
  });
});
