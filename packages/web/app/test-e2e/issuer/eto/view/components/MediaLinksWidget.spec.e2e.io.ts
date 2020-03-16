import {
  assertIssuerDashboard,
  createAndLoginNewUser,
  fillForm,
  goToIssuerDashboard,
  tid,
} from "../../../../utils";
import { fillAndAssertFull, goToSection } from "../../EtoRegistrationUtils";
import { mediaForm } from "../../fixtures";
import { goToIssuerEtoView } from "../EtoViewUtils";

describe("Media Links", () => {
  before(() => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" });
    goToIssuerDashboard();

    fillAndAssertFull("eto-progress-widget-media", mediaForm);
    assertIssuerDashboard();
  });
  it("should not convert media links to lowercase #eto #p3", () => {
    goToSection("eto-progress-widget-media");

    cy.get(tid("issuer.eto.media-links.companyNews.row")).then($el => {
      const nextIndex = $el.length;

      cy.get(
        `${tid("issuer.eto.media-links.companyNews.row")} ${tid("issuer.eto.media-links.add")}`,
      ).click();

      const url = "http://www.example.com/About-Capital_Letters";

      fillForm({
        [`companyNews.${nextIndex}.publication`]: "Link with capital letters",
        [`companyNews.${nextIndex}.url`]: url,
        [`companyNews.${nextIndex}.title`]: "Link with capital letters",

        "eto-registration-media-submit": {
          type: "submit",
        },
      });

      assertIssuerDashboard();

      goToIssuerEtoView();
      cy.get(tid("eto.media-link"))
        .first()
        .should("have.attr", "href", url);
    });
  });
});
