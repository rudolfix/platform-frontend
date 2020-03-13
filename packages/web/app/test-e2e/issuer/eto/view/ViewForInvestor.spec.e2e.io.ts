import { etoPublicViewByIdLinkLegacy } from "../../../../components/appRouteUtils";
import { etoFixtureAddressByName, tid } from "../../../utils/index";
import { goToEtoPreview } from "../../../utils/navigation";
import { createAndLoginNewUser, getEto, loginFixtureAccount } from "../../../utils/userHelpers";
import { assertEtoView, getYesOrNo } from "./EtoViewUtils";

describe("Eto Investor View", () => {
  describe("Default account tests", () => {
    before(() => createAndLoginNewUser({ type: "investor", kyc: "business" }));

    it("should be tradable when transferability is set to true #eto #p2", () => {
      const ETO_ID_WITH_TRANSFERABILITY_ALLOWED = etoFixtureAddressByName("ETOInWhitelistState");

      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID_WITH_TRANSFERABILITY_ALLOWED));
      assertEtoView(ETO_ID_WITH_TRANSFERABILITY_ALLOWED);

      getEto(ETO_ID_WITH_TRANSFERABILITY_ALLOWED).then(etoData => {
        // TOKEN HOLDER RIGHTS section
        cy.get(tid("eto-public-view-token-transferability")).should(
          "contain",
          getYesOrNo(etoData.enableTransferOnSuccess, true),
        );
      });
    });
    it("should show disclaimer when eto product type is prospectus #eto #p2", () => {
      const ETO_ID_WITH_TRANSFERABILITY_ALLOWED = etoFixtureAddressByName("ETOInWhitelistState");

      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID_WITH_TRANSFERABILITY_ALLOWED));
      assertEtoView(ETO_ID_WITH_TRANSFERABILITY_ALLOWED);

      getEto(ETO_ID_WITH_TRANSFERABILITY_ALLOWED).then(etoData => {
        // TOKEN HOLDER RIGHTS section
        cy.get(tid("eto-public-view-token-transferability")).should(
          "contain",
          getYesOrNo(etoData.enableTransferOnSuccess, true),
        );
      });
    });
  });

  describe("Fixtures tests", () => {
    it("coming soon state should not have token terms #eto #p3", () => {
      loginFixtureAccount("ISSUER_PREVIEW");
      goToEtoPreview();

      cy.get(tid("eto-public-view-token-terms")).should("exist");

      cy.get(tid("eto.public-view.investor-preview-banner.view-as-investor")).click();

      cy.get(tid("eto-public-view.disclaimer")).should("exist");

      cy.get(tid("eto-public-view-token-terms")).should("not.exist");
    });

    it("should have token terms in listed state #eto #p3", () => {
      loginFixtureAccount("ISSUER_LISTED");
      goToEtoPreview();

      cy.get(tid("eto-public-view-token-terms")).should("exist");
    });
  });
});
