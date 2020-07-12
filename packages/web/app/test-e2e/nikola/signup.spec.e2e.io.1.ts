import { tid } from "../utils/index";
import { cyan } from "color-name";
import { generateRandomEmailAddress } from "../utils/userHelpers";

describe("Signup", () => {
  it("should sign up with light wallet", () => {
    const email = generateRandomEmailAddress();
    const password = "myStrongPassword";
    cy.visit("/");

    cy.get(tid("Header-register")).click();

    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.get("#repeatPassword").type(password);

    cy.get(tid("wallet-selector-register-password")).find("[type='password']").should('be.visible') 
    cy.get(tid("wallet-selector-register-password")).find("[type='text']").should('not.be.visible')

    cy.get(tid("wallet-selector-register-password.adornment")).click();
    
    cy.get(tid("wallet-selector-register-password")).find("[type='password']").should('not.be.visible')
    cy.get(tid("wallet-selector-register-password")).find("[type='text']").should('be.visible') 

    cy.get(tid("wallet-selector-register-tos")).click();

    cy.get(tid("wallet-selector-register-button")).click();
  });
});
//should I group the test into smaller pieces and name them separately?
