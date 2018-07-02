import { get } from "lodash";

import { tid } from "../../../../../test/testUtils";
import {
  assertUserInDashboard,
  loginWithLightWallet,
  mockApiUrl,
  registerWithLightWallet,
} from "../../../../e2e-test-utils";
import { typeEmailPassword } from "../../../../e2e-test-utils/index";

describe("Light wallet login / register", () => {
  it("should register user with light-wallet and send email", () => {
    const email = "moe@test.com";
    const password = "strongpassword";

    cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "DELETE" });

    registerWithLightWallet(email, password);

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

    loginWithLightWallet(email, password);

    assertUserInDashboard();
  });

  it("should recognize correctly ETO user and save metada correctly", () => {
    const email = "moe3@test.com";
    const password = "strongpassword";

    registerWithLightWallet(email, password);

    cy.get(tid("Header-logout")).click();

    loginWithLightWallet(email, password);

    assertUserInDashboard().then(() => {
      const savedMetadata = window.localStorage.NF_WALLET_METADATA;
      cy.clearLocalStorage().then(() => {
        window.localStorage.NF_WALLET_ISSUER_METADATA = savedMetadata;

        cy.visit("eto/login/light");
        cy.contains(tid("light-wallet-login-with-email-email-field"), email);
        cy.get(tid("light-wallet-login-with-email-password-field")).type(password);
        cy.get(tid("wallet-selector-nuewallet.login-button")).click();

        return assertUserInDashboard().then(() => {
          expect(window.localStorage.NF_WALLET_METADATA).to.be.deep.eq(savedMetadata);
        });
      });
    });
  });

  it("should return an error when logging with same email", () => {
    // Special email @see https://github.com/Neufund/platform-backend/tree/master/deploy#dev-fixtures
    const email = "0x42912@neufund.org";
    const password = "strongpassword";
    const repeatedEmail = "email has already been registered";

    cy.visit("/register");
    typeEmailPassword(email, password);

    cy
      .get(tid("components.shared-warning-alert.message"))
      .then(errorMsg => expect(errorMsg.text()).to.contain(repeatedEmail));
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
