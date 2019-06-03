import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { tid } from "../utils/selectors";
import { getEto } from "../utils/userHelpers";

interface IAssertView {
  companyName: string;
  equityTokenName: string;
  equityTokenSymbol: string;
  jurisdiction: string;
}

export const assertEtoView = (etoID: string) => {
  getEto(etoID).then(eto => {
    cy.get(tid("eto.public-view")).should("exist");
    cy.title().should(
      "eq",
      `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})` +
        " - Neufund Platform",
    );
    if (eto.product.jurisdiction) {
      cy.get(tid(`eto.public-view.jurisdiction-banner.${eto.product.jurisdiction}`)).should(
        "exist",
      );
      cy.url().should("contain", eto.product.jurisdiction);
    } else {
      cy.get(tid(`eto.public-view.investor-preview-banner`)).should("exist");
    }
  });
};

export const assertIssuerEtoView = () => {
  cy.url().should("contain", "/eto/view");
  cy.get(tid("eto.public-view")).should("exist");
};
