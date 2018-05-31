import { tid } from "../../../../../test/testUtils";

const testEmail = "moe@test.com";
const password = "strongpassword";

export const assertUserInDashboard = () => {
  cy.url().should("contain", "/dashboard");
};

export const registerWithLightWallet = (email: string, password: string) => {
  cy.visit("/register");

  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);
  cy.get(tid("wallet-selector-register-button")).click();

  cy.url().should("contain", "/dashboard");
};

export const loginWithLightWallet = (testEmail: string, password: string) => {
  registerWithLightWallet(testEmail, password);

  cy.get(tid("Header-logout")).click();
  cy.get(tid("Header-login")).click();
  cy.get(tid("wallet-selector-light")).click();

  cy.contains(tid("wallet-selector-nuewallet.login-email"), testEmail);
  cy.get(tid("wallet-selector-nuewallet.login-password")).type(password);
  cy.get(tid("wallet-selector-nuewallet.login-button")).click();

  assertUserInDashboard();
};

describe("Light Wallet as Investor", () => {
  it("should register user with light-wallet", () => {
    registerWithLightWallet(testEmail, password);
  });
  it("should register/login user with light-wallet", () => {
    loginWithLightWallet(testEmail, password);
  });
});
