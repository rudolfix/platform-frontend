import {
  etoPublicViewByIdLink,
  etoPublicViewByIdLinkLegacy,
} from "../../../../components/appRouteUtils";
import { EJurisdiction } from "../../../../lib/api/eto/EtoProductsApi.interfaces";
import { assertDashboard } from "../../../utils/assertions";
import { etoFixtureAddressByName } from "../../../utils/index";
import { loginFixtureAccount } from "../../../utils/userHelpers";
import { assertEtoView } from "./EtoViewUtils";

describe("Eto LI Investor View", () => {
  beforeEach(() => loginFixtureAccount("SPARE_1"));

  describe("for ETO with LI jurisdiction @eto @p3", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    it("should allow to visit ", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));
      assertEtoView(ETO_ID);
    });

    it("should not allow link with wrong jurisdiction @eto @p3", () => {
      cy.visit(etoPublicViewByIdLink(ETO_ID, EJurisdiction.GERMANY));
      assertDashboard();
    });
  });

  describe("for ETO with GE jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");

    it("should not allow to visit @eto @p3", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

      assertDashboard();
    });
  });
});
