import { get } from "lodash";

import { MOCK_API_URL } from "../config";
import { getLatestEmailByUser } from "./assertions";

export const getLatestVerifyUserEmailLink = (
  email: string,
  attempts = 5,
): Cypress.Chainable<string> =>
  cy
    .request({ url: MOCK_API_URL + `sendgrid/session/mails?to=${email}`, method: "GET" })
    .then(r => {
      const latestEmailByUser = getLatestEmailByUser(r, email);
      const activationLink = get(latestEmailByUser, "template_vars.activation_link");

      if (activationLink) {
        // we need to replace the loginlink pointing to a remote destination
        // with one pointing to our local instance
        return activationLink.replace("platform.neufund.io", "localhost:9090");
      } else {
        expect(attempts, `Failed to find activation link for email ${email}`).to.be.gt(0);
        cy.wait(1000);
        return getLatestVerifyUserEmailLink(email, attempts - 1);
      }
    });

export const assertWaitForLatestEmailSentWithSalt = (
  userEmail: string,
  timeout: number = 20000,
) => {
  expect(timeout, `Email not received in ${timeout} ms`).to.be.gt(0);

  cy.wait(1000);

  cy.request({
    url: MOCK_API_URL + `sendgrid/session/mails?to=${userEmail}`,
    method: "GET",
  }).then(r => {
    if (r.status === 200 && getLatestEmailByUser(r, userEmail)) {
      const loginLink = get(getLatestEmailByUser(r, userEmail), "template_vars.activation_link");
      expect(loginLink).to.contain("salt");
      return;
    }
    assertWaitForLatestEmailSentWithSalt(userEmail, timeout - 1000);
  });
};
