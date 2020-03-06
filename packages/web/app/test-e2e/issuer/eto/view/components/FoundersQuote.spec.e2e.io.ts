import { goToEtoPreview, loginFixtureAccount, tid } from "../../../../utils/index";

const assertFoundersQuote = () => {
  goToEtoPreview();
  cy.get(tid("eto-overview-status-founders-quote")).should("exist");
  cy.get(tid("eto.public-view.investor-preview-banner.view-as-investor")).click();
  cy.get(tid("eto-overview-status-founders-quote")).should("exist");
};

describe("ETO founders quote", () => {
  // TODO: Find why default hdPath is not a valid one
  it.skip("should display founders quote for eto in draft state for both issuer and investor #eto #p3 #flaky", () => {
    loginFixtureAccount("ISSUER_HAS_KYC_AND_FILLED_COMPANY_DATA");

    assertFoundersQuote();
  });

  it("should display founders quote for eto in campaign state for both issuer and investor #eto #p3", () => {
    loginFixtureAccount("ISSUER_LISTED");

    assertFoundersQuote();
  });

  it("should display founders quote for eto in pending state for both issuer and investor #eto #p3", () => {
    loginFixtureAccount("ISSUER_PENDING");

    assertFoundersQuote();
  });
});
