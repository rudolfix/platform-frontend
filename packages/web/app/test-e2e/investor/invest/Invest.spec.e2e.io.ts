import { goToEtoViewById } from "../../issuer/eto/view/EtoViewUtils";
import { assertDashboard } from "../../utils/assertions";
import { etoFixtureAddressByName, goToDashboard } from "../../utils/index";
import { tid } from "../../utils/selectors";
import { loginFixtureAccount } from "../../utils/userHelpers";

describe("Invest", () => {
  it("should block investment flow for US investors #investment #p3", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    loginFixtureAccount("demoinvestor10");

    goToEtoViewById(PUBLIC_ETO_ID);

    cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).should("not.exist");

    cy.get(tid("investment-widget.us-investor-message")).should("exist");

    cy.get(tid("investment-widget.us-investor-message.go-to-dashboard")).click();

    assertDashboard();
  });

  it("should start wallet upgrade from investment column #investment #p3", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    // TODO: you need another fixture that has ICBM wallet but is not upgraded in any other test
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC");
    goToDashboard();

    cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
    // click invest now button
    cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();

    cy.get(tid("investment-type.selector.ICBM_NEUR.enable-wallet")).click();

    // check if upgrade accept has shown
    cy.get(tid("modals.tx-sender.upgrade-flow.summery.upgradeSummary.accept")).should("exist");

    // TODO: Cover full flow with new fixture when available
  });
});
