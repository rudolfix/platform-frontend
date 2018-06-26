import { tid } from "../../test/testUtils";
import { appRoutes } from "../components/appRoutes";

export const assertEtoDashboard = () => {
  cy.url().should("contain", "/dashboard");
  cy.get(tid("eto-dashboard-application")).should("exist");
};

export const registerWithLightWalletETO = (email: string, password: string) => {
  cy.visit("eto/register/light");

  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);
  cy.get(tid("wallet-selector-register-button")).click();

  assertEtoDashboard();
};

// todo: extract it to separate file
// do it after moving all e2e tests back into cypress directory
export const mockApiUrl = `${process.env.NF_REMOTE_BACKEND_PROXY_ROOT ||
  "https://localhost:9090/api/"}external-services-mock/`;

export const assertUserInDashboard = () => {
  return cy.url().should("contain", appRoutes.dashboard);
};

export const registerWithLightWallet = (email: string, password: string) => {
  cy.visit("/register");

  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);
  cy.get(tid("wallet-selector-register-button")).click();

  assertUserInDashboard();
};

export const loginWithLightWallet = (email: string, password: string) => {
  cy.get(tid("Header-login")).click();
  cy.get(tid("wallet-selector-light")).click();

  cy.contains(tid("light-wallet-login-with-email-email-field"), email);
  cy.get(tid("light-wallet-login-with-email-password-field")).type(password);
  cy.get(tid("wallet-selector-nuewallet.login-button")).click();

  return assertUserInDashboard();
};
