import { accountFixtureAddress, loginFixtureAccount, tid } from "../../../utils/index";
import { assertEtoView, goToIssuerEtoView } from "./EtoViewUtils";

describe("Eto Preview For Issuer", () => {
  it("should change state depending whether it's issuer view or investor view @eto @p3", () => {
    const etoId = accountFixtureAddress("ISSUER_PREVIEW");

    loginFixtureAccount("ISSUER_PREVIEW");

    goToIssuerEtoView();

    // should be in the draft state
    cy.get(tid("eto-state-preview")).should("exist");

    // should have preview banner
    cy.get(tid("eto.public-view.investor-preview-banner")).should("exist");

    // should go to eto by preview code
    cy.get(tid("eto.public-view.investor-preview-banner.view-as-investor")).click();

    assertEtoView(etoId);

    // for investor view state should be set to coming soon
    cy.get(tid("eto-state-coming-soon")).should("exist");
  });
});
