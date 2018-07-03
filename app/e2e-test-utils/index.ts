import { get } from "lodash";
import { tid } from "../../test/testUtils";
import { appRoutes } from "../components/appRoutes";

export const assertEtoDashboard = () => {
  cy.url().should("contain", "/dashboard");
  cy.get(tid("eto-dashboard-application")).should("exist");
};

export const typeEmailPassword = (email: string, password: string) => {
  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);

  cy.get(tid("wallet-selector-register-button")).click();
};

export const registerWithLightWalletETO = (email: string, password: string) => {
  cy.visit("eto/register/light");

  typeEmailPassword(email, password);

  assertEtoDashboard();
};

export const typeLightwalletRecoveryPhrase = (words: string[]) => {
  for (let batch = 0; batch < words.length / 4; batch++) {
    for (let index = 0; index < 4; index++) {
      cy
        .get(tid(`seed-recovery-word-${batch * 4 + index}`, "input"))
        .type(words[batch * 4 + index], { force: true, timeout: 20 })
        .type("{enter}", { force: true });
    }

    if (batch + 1 < words.length / 4) {
      cy.get(tid("btn-next")).click();
    }
  }

  cy.get(tid("btn-send")).click();
};

// todo: extract it to separate file
// do it after moving all e2e tests back into cypress directory
export const mockApiUrl = `${process.env.NF_REMOTE_BACKEND_PROXY_ROOT ||
  "https://localhost:9090/api/"}external-services-mock/`;

export const verifyLatestUserEmail = () => {
  cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "GET" }).then(r => {
    const activationLink = get(r, "body[0].personalizations[0].substitutions.-activationLink-") as
      | string
      | undefined;
    if (activationLink) {
      // we need to replace the loginlink pointing to a remote destination with one pointing to our local instance
      const cleanedActivationLink = activationLink.replace("platform.neufund.io", "localhost:9090");
      cy.visit(cleanedActivationLink);
      cy.get(tid("email-verified")); // wait for the email verified button to show
    }
  });
};

export const assertUserInDashboard = () => {
  return cy.url().should("contain", appRoutes.dashboard);
};

export const convertToUniqueEmail = (email: string) => {
  const splitEmail = email.split("@");
  const randomString = Math.random()
    .toString(36)
    .slice(2);
  return `${splitEmail[0]}-${randomString}@${splitEmail[1]}`;
};

export const registerWithLightWallet = (
  email: string,
  password: string,
  uniqueEmail: boolean = false,
) => {
  if (uniqueEmail) {
    email = convertToUniqueEmail(email);
  }

  cy.visit("/register");

  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);
  cy.get(tid("wallet-selector-register-button")).click();

  assertUserInDashboard();
};

export const logoutViaTopRightButton = () => {
  cy.get(tid("Header-logout")).click();
  cy.get(tid("landing-page")); // wait for landing page to show
};

export const loginWithLightWallet = (email: string, password: string) => {
  cy.get(tid("Header-login")).click();
  cy.get(tid("wallet-selector-light")).click();

  cy.contains(tid("light-wallet-login-with-email-email-field"), email);
  cy.get(tid("light-wallet-login-with-email-password-field")).type(password);
  cy.get(tid("wallet-selector-nuewallet.login-button")).click();

  return assertUserInDashboard();
};
