import { goToIssuerDashboard, loginFixtureAccount, tid } from "../utils";
import { assertPublicStep } from "./EtoRegistrationUtils";

describe("Eto public state", () => {
  it("should not show bookbuilding stats after presale", () => {
    loginFixtureAccount("ISSUER_PUBLIC", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    });

    goToIssuerDashboard();

    assertPublicStep();

    cy.get(tid("bookbuilding-widget.closed")).should("not.exist");
  });
});
