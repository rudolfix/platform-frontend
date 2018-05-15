import { tid } from "../../../../test/testUtils";

const LONG_TIMEOUT = 10000;

describe("WalletSelector > Light", () => {
  it("should be able to create an account", () => {
    cy.visit("/");

    cy.get(tid("Header-login")).click();
    cy.get(tid("neuwallet-missing-email")).should("exist"); // missing newwallet data

    cy.get(tid("wallet-selector-opposite-route-link")).click();
    cy.url().should("contain", "/register/light");

    cy.get(tid("wallet-selector-register-email")).type("john-smith@example.com");
    cy.get(tid("wallet-selector-register-password")).type("strongpassword");
    cy.get(tid("wallet-selector-register-confirm-password")).type("strongpassword{enter}");
    cy.url({ timeout: LONG_TIMEOUT }).should("contain", "/dashboard");
  });
});
