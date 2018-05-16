import { tid } from "../../../../../test/testUtils";

const LONG_TIMEOUT = 5000;

export const registerWithLightWallet = (email: string, password: string) => {
  cy.visit("/register");

  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);
  cy.get(tid("wallet-selector-register-button")).click();

  cy.url({ timeout: LONG_TIMEOUT }).should("contain", "/dashboard");
};

describe("Wallet backup recovery phrase", () => {
  it("should register user with light-wallet", () => {
    registerWithLightWallet("moe@test.com", "strongpassword");
  });
});
