import { tid } from "../../../../../test/testUtils";
import { appRoutes } from "../../../appRoutes";

export const email = "moe@test.com";
export const password = "strongpassword";

export const registerWithLightWallet = (email: string, password: string) => {
  cy.visit("/register");

  cy.get(tid("wallet-selector-register-email")).type(email);
  cy.get(tid("wallet-selector-register-password")).type(password);
  cy.get(tid("wallet-selector-register-confirm-password")).type(password);
  cy.get(tid("wallet-selector-register-button")).click();
  cy.wait(5000).visit(appRoutes.dashboard);
  cy.url().should("contain", appRoutes.dashboard);
};

describe("Wallet backup recovery phrase", () => {
  it("should register user with light-wallet", () => {
    registerWithLightWallet(email, password);
  });
});
