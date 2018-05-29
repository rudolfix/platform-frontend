import { tid } from "../../../../../test/testUtils";

export const registerWithLightWallet = (email: string, password: string) => {
  cy.visit("eto/register/light");

  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);
  cy.get(tid("wallet-selector-register-button")).click();
  cy.url().should("contain", "/dashboard");
  cy.get(tid("eto-dashboard-header")).should("exist");
};

describe("Wallet backup recovery phrase", () => {
  it("should register user with light-wallet", () => {
    registerWithLightWallet("moe@test.com", "strongpassword");
  });
});
