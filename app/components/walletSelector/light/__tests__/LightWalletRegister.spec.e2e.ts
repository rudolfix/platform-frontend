import { get } from "lodash";

import { tid } from "../../../../../test/testUtils";
import { appRoutes } from "../../../appRoutes";

// todo: extract it to separate file
// do it after moving all e2e tests back into cypress directory
const mockApiUrl = `${process.env.NF_REMOTE_BACKEND_PROXY_ROOT ||
  "https://localhost:9090/api/"}external-services-mock/`;

export const registerWithLightWallet = (email: string, password: string) => {
  cy.visit("/register");

  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);
  cy.get(tid("wallet-selector-register-button")).click();

  cy.url().should("contain", appRoutes.dashboard);
};

describe("Light wallet login / register", () => {
  it("should register user with light-wallet and send email", () => {
    const email = "moe@test.com";
    const password = "strongpassword";

    cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "DELETE" });

    registerWithLightWallet(email, password);

    cy.wait(2000);
    cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "GET" }).then(r => {
      const email = get(r, "body[0].personalizations[0].to[0]") as string | undefined;

      expect(email).to.be.eq(email);
    });
  });

  it("should remember light wallet details after logout", () => {
    const email = "moe2@test.com";
    const password = "strongpassword";

    registerWithLightWallet(email, password);

    cy.get(tid("Header-logout")).click();

    cy.get(tid("Header-login")).click();

    cy.get(tid("light-wallet-login-with-email-email-field")).should("contain", email);
    cy.get(tid("light-wallet-login-with-email-password-field")).type(password + "{enter}");

    cy.url().should("contain", "/dashboard");
  });

  // This test case is commented due to cypressjs bugs which occurs while reusing cy.visit
  /**
  it("should recover vault from email", () => {
    const email = "moe3@test.com";
    const password = "strongpassword";

    cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "DELETE" });

    registerWithLightWallet(email, password);

    cy.get(tid("Header-logout")).click();
    cy.clearLocalStorage();

    cy.writeFile('/tmp/cypress-outout.log', 'test!')

    cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "GET" }).then(r => {
      cy.writeFile('/tmp/cypress-outout.log', 'test2!')
      cy.writeFile('/tmp/cypress-outout.log', r.body)

      cy.exec(`echo '${JSON.stringify(r.body)}' > /tmp/test.txt`);
      cy.log(`echo '${JSON.stringify(r.body)}' > /tmp/test.txt`);

      const emailLinkVerification = get(
        r,
        `body[0].personalizations[0].substitutions["-loginLink-"]`,
      );
      const emailLinkVerificationWithFixedDomain = emailLinkVerification.replace(
        process.env.NF_REMOTE_BACKEND_PROXY_ROOT!.replace("api/", ""),
        "https://localhost:9090/",
      );

      cy.visit(emailLinkVerificationWithFixedDomain);

      cy.get(tid("light-wallet-login-with-email-email-field")).should("contain", email);
      cy.get(tid("light-wallet-login-with-email-password-field")).type(password + "{enter}");

      cy.url().should("contain", "/dashboard");
    });
  });*/
});
