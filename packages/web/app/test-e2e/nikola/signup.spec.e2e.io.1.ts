import { tid } from "../utils/index";
import { cyan } from "color-name";
import { generateRandomEmailAddress } from "../utils/userHelpers";

describe("Signup", () => {
  it("should sign up with light wallet", () => {
    const email = generateRandomEmailAddress();
    const password = "myStrongPassword";
    cy.visit("/");

    cy.get(tid("Header-register")).click();
    //how do I click on eye symbol?

    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.get("#repeatPassword").type(password);

    //why the tid?
    cy.get(tid("wallet-selector-register-tos")).click();

    cy.get(tid("wallet-selector-register-button")).click();
  });
});
//should I group the test into smaller pieces and name them separately?
