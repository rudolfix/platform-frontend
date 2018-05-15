import { tid } from "../../../../../test/testUtils";

export const registerWithLightWallet = () => {
  cy.visit("/register");

  cy.get(tid("wallet-selector-register-email")).type("moe@test.com");
  cy.get(tid("wallet-selector-register-password")).type("strongpassword");
  cy.get(tid("wallet-selector-register-confirm-password")).type("strongpassword");

  cy.get(tid("wallet-selector-register-button")).click();
};

describe("Wallet backup recovery phrase", () => {
  it("should register user with light0-wallet", () => {
    registerWithLightWallet();
    cy.url().should("contain", "/dashboard");
  });
});
