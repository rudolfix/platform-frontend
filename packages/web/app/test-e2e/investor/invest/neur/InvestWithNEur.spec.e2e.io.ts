import {
  assertButtonIsActive,
  closeModal,
  confirmAccessModal,
  etoFixtureAddressByName,
  goToDashboard,
  loginFixtureAccount,
  parseAmount,
  tid,
} from "../../../utils/index";

describe("NEur", () => {
  it("should invest NEur and check whether UI is refreshed with invested amount #investment #p1", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    const INVESTED_NEUR_AMOUNT = 10.99;

    loginFixtureAccount("demoinvestor1");

    goToDashboard();

    // click invest now button
    cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();

    cy.get(`${tid("investment-widget-total-nEur-invested")} ${tid("value")}`)
      .then($e => parseAmount($e.text()))
      .as("nEurInvested");

    cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();

    cy.get(tid("investment-type.selector.NEUR")).check({ force: true });

    cy.get(tid("invest-modal-eur-field"))
      .clear()
      .type(INVESTED_NEUR_AMOUNT.toString());

    // wait for calculation to complete
    assertButtonIsActive("invest-modal-invest-now-button");

    cy.get(tid("invest-modal.est-neu-tokens"))
      .then($element => parseAmount($element.text()))
      .as("estimatedReward");

    cy.get(tid("invest-modal-invest-now-button")).click();

    cy.get(tid("invest-modal-summary-confirm-button")).click();

    confirmAccessModal();

    cy.get(tid("investment-flow.success.title")).should("exist");

    closeModal();
  });
});
