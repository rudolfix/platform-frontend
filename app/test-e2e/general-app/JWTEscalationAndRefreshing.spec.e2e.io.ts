import * as moment from "moment";

import { AUTH_TOKEN_REFRESH_THRESHOLD } from "../../modules/auth/constants";
import { getJwtExpiryDate } from "../../utils/JWTUtils";
import {
  acceptWallet,
  assertEmailChangeFlow,
  assertUserInLightWalletLoginPage,
  goToDashboard,
  goToProfile,
  tid,
} from "../utils";
import { fillForm } from "../utils/forms";
import {
  createAndLoginNewUser,
  generateRandomEmailAddress,
  getJwtToken,
} from "../utils/userHelpers";

describe("JWT Refreshing and Escalation", function(): void {
  it("should logout with session timeout message when token is already expired", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();

      cy.clock(Date.now());

      const jwtExpiryDate = getJwtExpiryDate(getJwtToken());

      const diff = jwtExpiryDate.diff(moment(), "milliseconds");
      const expectedTokenRefreshTimeFromNow = diff * AUTH_TOKEN_REFRESH_THRESHOLD;

      // add ten seconds to simulate inactivity (for e.g. hibernation)
      cy.tick(expectedTokenRefreshTimeFromNow + 10000);

      assertUserInLightWalletLoginPage();

      cy.get(tid("wallet-selector-session-timeout-notification")).should("exist");
    });
  });

  it("should refresh jwt token", () => {
    cy.server();
    cy.route("POST", "**/jwt/refresh").as("jwtRefresh");

    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();

      const now = Date.now();

      cy.clock(now);

      const jwtToken = getJwtToken();

      const jwtExpiryDate = getJwtExpiryDate(jwtToken);

      const diff = jwtExpiryDate.diff(now, "milliseconds");

      const expectedTokenRefreshTimeFromNow = diff - AUTH_TOKEN_REFRESH_THRESHOLD;

      cy.tick(expectedTokenRefreshTimeFromNow + 1);

      cy.wait("@jwtRefresh");

      // Should refresh jwt token in localstorage
      cy.wrap(jwtToken).should(token => {
        expect(token).to.not.equal(getJwtToken());
      });
    });
  });

  it("should escalate jwt token with new permissions", () => {
    cy.server();
    cy.route("POST", "**/jwt/create").as("jwtEscalate");

    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToProfile();

      assertEmailChangeFlow();

      const jwtToken = getJwtToken();

      fillForm({
        email: generateRandomEmailAddress(),
        "verify-email-widget-form-submit": { type: "submit" },
      });

      acceptWallet();

      // Should send current jwt during escalation to preserve existing permissions
      cy.wait("@jwtEscalate").should((xhr: Cypress.WaitXHR) => {
        expect(xhr.request.headers.authorization).to.equal(`Bearer ${jwtToken}`);
      });

      // Should refresh jwt localstorage
      cy.wrap(jwtToken).should(token => {
        expect(token).to.not.equal(getJwtToken());
      });
    });
  });
});
