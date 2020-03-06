import { withParams } from "@neufund/shared";

import { appRoutes } from "../../../components/appRoutes";
import { assertLanding } from "../../utils/assertions";
import { tid } from "../../utils/selectors";

const goToEmailUnsubscription = (email: string, confirmationUrl: string) => {
  cy.visit({
    url: withParams(appRoutes.unsubscription, { email }),
    qs: {
      confirmationUrl,
    },
  });
};

const assertUnsubscriptionSuccess = () => {
  cy.get(tid("unsubscription.success")).should("exist");

  cy.url().should("contain", appRoutes.unsubscriptionSuccess);
};

const FAKE_EMAIL = "dev@neufund.io";

// it's a fake confirmation url just used to match regex
const FAKE_CONFIRMATION_URL =
  "https://localhost:9090/api/newsletter/subscriptions/subs_id/topics/news?signature=subs_sig&timestamp=1581216267";

describe("Email Unsubscription", () => {
  it("should show invalid unsubscription link #emailing #p3", () => {
    goToEmailUnsubscription(FAKE_EMAIL, "invalid unsubscription link");

    cy.get(tid("unsubscription.invalid-confirmation-url")).should("exist");
  });

  it("should go through unsubscription success flow #emailing #p3", () => {
    // stub confirmation request so we can control the response
    cy.server();
    cy.route({
      url: FAKE_CONFIRMATION_URL,
      response: {},
    });

    goToEmailUnsubscription(FAKE_EMAIL, FAKE_CONFIRMATION_URL);

    cy.get(tid("unsubscription.confirmation")).should("exist");

    cy.get(tid("unsubscription.confirmation.email")).contains(FAKE_EMAIL);

    cy.get(tid("unsubscription.confirmation.confirm")).click();

    assertUnsubscriptionSuccess();
  });

  it("should handle properly unsubscription api failure flow #emailing #p3", () => {
    // stub confirmation request so we can control the response
    cy.server();
    cy.route({
      url: FAKE_CONFIRMATION_URL,
      response: {},
      status: 400,
    });

    goToEmailUnsubscription(FAKE_EMAIL, FAKE_CONFIRMATION_URL);

    cy.get(tid("unsubscription.confirmation")).should("exist");

    cy.get(tid("unsubscription.confirmation.email")).contains(FAKE_EMAIL);

    cy.get(tid("unsubscription.confirmation.confirm")).click();

    assertLanding();
  });
});
