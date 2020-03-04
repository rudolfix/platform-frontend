import { etoPublicViewByIdLinkLegacy } from "../../../../components/appRouteUtils";
import { assertLanding, etoFixtureAddressByName, tid } from "../../../utils/index";
import { assertEtoView } from "./EtoViewUtils";

describe("Eto Unauthorized View", () => {
  describe("for ETO with LI jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    it("should not show jurisdiction disclaimer modal #eto #p3", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

      assertEtoView(ETO_ID);
      cy.get(tid("jurisdiction-disclaimer-modal")).should("not.exist");
    });
  });

  describe("for ETO with GE jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");

    it("should show jurisdiction disclaimer modal and allow to stay after confirm #eto #p3", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

      cy.get(tid("jurisdiction-disclaimer-modal")).should("exist");

      cy.get(tid("jurisdiction-disclaimer-modal.confirm")).click();
      assertEtoView(ETO_ID);
    });

    it("should show jurisdiction disclaimer modal and navigate to dashboard on deny #eto #p3", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

      cy.get(tid("jurisdiction-disclaimer-modal")).should("exist");

      cy.get(tid("jurisdiction-disclaimer-modal.deny")).click();

      assertLanding();
    });
  });

  it("should show register button #eto #p3", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));
    assertEtoView(ETO_ID);

    cy.get(tid("eto-widget-register-to-invest-button")).should("exist");
  });
});
