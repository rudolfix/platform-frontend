import { etoFixtureAddressByName, tid } from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { goToEtoViewById } from "./EtoViewUtils";

const asserISHADocumentsHidden = () => {
  // assert ISHA is hidden in investment terms form
  cy.get(
    tid("eto-public-view.investment-terms.document.signed_investment_and_shareholder_agreement"),
  ).should("not.exist");
  cy.get(
    tid("eto-public-view.investment-terms.document.investment_and_shareholder_agreement_preview"),
  ).should("not.exist");
  cy.get(tid("eto-public-view.investment-terms.document.signed_termsheet")).should("exist");

  // assert ISHA is hidden from legal documents
  cy.get(tid("eto-public-view.documents.signed_investment_and_shareholder_agreement")).should(
    "not.exist",
  );
  cy.get(tid("eto-public-view.documents.investment_and_shareholder_agreement_preview")).should(
    "not.exist",
  );
  cy.get(tid("eto-public-view.documents.investment_and_shareholder_agreement")).should("not.exist");
};

describe("Eto ISHA documents", () => {
  it("should hide ISHA documents from unauthorized and unverified user", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInClaimState");

    // assert for unauthorized user
    goToEtoViewById(ETO_ID);
    asserISHADocumentsHidden();

    // assert for logged in user unverified user
    createAndLoginNewUser({ type: "investor" });

    goToEtoViewById(ETO_ID);
    asserISHADocumentsHidden();
  });
});
