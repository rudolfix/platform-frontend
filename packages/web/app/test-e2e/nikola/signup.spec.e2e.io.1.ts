import { tid } from "../utils/index";
import { cyan } from "color-name";

describe("Signup", () => {
  it("should sign up with light wallet", () => {
    cy.visit("https://localhost:9090");

    cy.get(tid("Header-register")).click();
    //QUESTION - how do I toggle random input, to avoid email reuse?
    //how do I click on eye symbol?

    cy.get("#email").type("email@test.com");
    cy.get("#password").type("dupadupa");

    //how do I make this line reuse the previously used password instead of typing?
    cy.get("#repeatPassword").should("be.visible");
    cy.get("#repeatPassword").type("dupadupa");
    //this is wrong and I can't find the right command: cy.get("#repeatPassword").should("have.length", 8)

    //why the tid?
    cy.get(tid("wallet-selector-register-tos")).click();

    cy.get(tid("wallet-selector-register-button")).should("be.enabled");
    cy.get(tid("wallet-selector-register-button")).click();
  });
});
//should I group the test into smaller pieces and name them separately?
