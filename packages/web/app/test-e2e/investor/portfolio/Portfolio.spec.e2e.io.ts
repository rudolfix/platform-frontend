import { externalRoutes } from "../../../config/externalRoutes";
import { goToPortfolio, loginFixtureAccount, tid } from "../../utils";

describe("Portfolio", () => {
  it("should open neufund community page #portfolio #payout #p3", () => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC");

    goToPortfolio();

    cy.get(tid("asset-portfolio.payout.community-tooltip.trigger")).trigger("mouseover");

    cy.get(tid("asset-portfolio.payout.community-link")).should(
      "have.attr",
      "href",
      externalRoutes.neufundCommunity,
    );
  });
});
