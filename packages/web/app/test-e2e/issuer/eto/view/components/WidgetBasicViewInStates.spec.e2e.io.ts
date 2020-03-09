import { withParams } from "@neufund/shared";

import { appRoutes } from "../../../../../components/appRoutes";
import { etherscanAddressLink } from "../../../../../components/appRouteUtils";
import { e2eRoutes } from "../../../../../components/testing/e2eRoutes";
import { TEtoSpecsData } from "../../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { assertIsExternalLink } from "../../../../utils/assertions";
import { etoFixtureAddressByName, tid } from "../../../../utils/index";
import { getEto } from "../../../../utils/userHelpers";

// TODO: Get preview code deterministically
const etoPreviewLink = (previewCode: string, jurisdiction: string) =>
  new RegExp(
    withParams(appRoutes.etoPublicView, {
      previewCode,
      jurisdiction,
    }),
  );

describe("Eto widget page", () => {
  it("should show basic widget view #eto #widget #p2", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInSetupState");
    getEto(ETO_ID).then((eto: TEtoSpecsData) => {
      cy.visit(withParams(e2eRoutes.embeddedWidget, { previewCode: eto.previewCode }));

      cy.iframe("iframe").within($iframe => {
        cy.wrap($iframe)
          .find(tid("logged-out-campaigning-register"))
          .click();

        cy.get("@windowOpen").should("be.calledWithMatch", appRoutes.register, "_blank");

        assertIsExternalLink("eto-overview-pitch-deck-button", cy.wrap($iframe));

        cy.get(tid("eto-overview-pitch-deck-button")).should("have.attr", "href");

        assertIsExternalLink("eto-overview-status-token", cy.wrap($iframe));

        assertIsExternalLink("eto-overview-term-sheet-button", cy.wrap($iframe));

        cy.wrap($iframe)
          .find(tid("eto-overview-term-sheet-button"))
          .should("have.attr", "href")
          .and("match", etoPreviewLink(eto.previewCode, eto.product.jurisdiction));

        assertIsExternalLink("eto-overview-investment-memorandum-button", cy.wrap($iframe));

        cy.wrap($iframe)
          .find(tid("eto-overview-investment-memorandum-button"))
          .should("have.attr", "href")
          .and("match", etoPreviewLink(eto.previewCode, eto.product.jurisdiction));

        assertIsExternalLink("eto-overview-smart-contract-on-chain-button", cy.wrap($iframe));

        cy.wrap($iframe)
          .find(tid("eto-overview-smart-contract-on-chain-button"))
          .should("have.attr", "href", etherscanAddressLink(eto.etoId));

        cy.wrap($iframe).find(tid("eto-overview-powered-by"));
      });
    });
  });

  it("should show widget in setup state #eto #widget #p3", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInSetupState");

    getEto(ETO_ID).then((eto: TEtoSpecsData) => {
      cy.visit(withParams(e2eRoutes.embeddedWidget, { previewCode: eto.previewCode }));

      cy.iframe("iframe")
        .find(tid("logged-out-campaigning-register"))
        .click();

      cy.get("@windowOpen").should("be.calledWithMatch", appRoutes.register, "_blank");
    });
  });

  it("should show widget in whitelisting state #eto #widget #p2", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");
    getEto(ETO_ID).then((eto: TEtoSpecsData) => {
      cy.visit(withParams(e2eRoutes.embeddedWidget, { previewCode: eto.previewCode }));

      cy.iframe("iframe").find(tid("eto-whitelist-countdown"));
    });
  });

  it("should show widget in public state #eto #widget #p3", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    getEto(ETO_ID).then((eto: TEtoSpecsData) => {
      cy.visit(withParams(e2eRoutes.embeddedWidget, { previewCode: eto.previewCode }));

      cy.iframe("iframe")
        .find(tid("eto-widget-invest-now-button"))
        .click();

      cy.get("@windowOpen").should(
        "be.calledWithMatch",
        etoPreviewLink(eto.previewCode, eto.product.jurisdiction),
        "_blank",
      );
    });
  });

  it("should show widget error when wrong url #eto #widget #p3", () => {
    const previewCode = "wrong-eto-id";

    cy.visit(withParams(e2eRoutes.embeddedWidget, { previewCode }));

    cy.iframe("iframe").find(tid("eto-widget-error"));
  });
});
