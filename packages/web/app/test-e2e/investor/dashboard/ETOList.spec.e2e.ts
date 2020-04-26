import { etoPublicViewByIdLinkLegacy } from "../../../components/appRouteUtils";
import { submitBookBuilding } from "../../issuer/eto/utils";
import { etoFixtureAddressByName } from "../../utils/fixtures";
import { goToDashboard, goToLanding } from "../../utils/navigation";
import { tid } from "../../utils/selectors";
import {
  createAndLoginNewUser,
  loginFixtureAccount,
  logout,
  makeAuthenticatedCall,
} from "../../utils/userHelpers";

describe("ETO list", () => {
  it("loads countdown to public sale for not logged in user #p2", () => {
    const etoId = etoFixtureAddressByName("ETOInWhitelistState");
    goToLanding();
    cy.get(tid(`eto-overview-${etoId}`)).within(() => {
      cy.get(tid("eto-whitelist-countdown"));
    });
  });

  it("loads investment status for logged in, whitelisted user #p2", () => {
    const etoId = etoFixtureAddressByName("ETOInWhitelistState");
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC");
    goToDashboard();

    cy.get(tid(`eto-overview-${etoId}`)).within(() => {
      cy.get(tid("investment-status-widget"));
    });
  });

  it("loads countdown to pre sale for logged in, whitelisted user #p2", () => {
    const etoId = etoFixtureAddressByName("ETOInSetupState");
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      cy.visit(etoPublicViewByIdLinkLegacy(etoId));

      cy.get(tid("eto-bookbuilding-remaining-slots"))
        .then($element => Number($element.text()))
        .as("remainingSlots");

      submitBookBuilding("10000", true);

      cy.saveLocalStorage("investor");
      logout();

      loginFixtureAccount("ISSUER_SETUP", {
        permissions: ["do-bookbuilding"],
      }).then(() =>
        // disable white listing so user will see the countdown to pre-sale
        makeAuthenticatedCall("/api/eto-listing/etos/me/bookbuilding", {
          method: "PUT",
          body: JSON.stringify({
            is_bookbuilding: false,
          }),
        }).then(() => {
          goToDashboard(false);
          logout();
          cy.restoreLocalStorage("investor");

          goToDashboard(false);

          cy.get(tid(`eto-overview-${etoId}`)).within(() => {
            cy.get(tid("eto-whitelist-countdown"));
          });
        }),
      );
    });
  });
});
