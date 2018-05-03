import { tid } from "../../../../test/testUtils";

describe("Landing", () => {
  it("should work", () => {
    cy.visit("/");

    cy.get(tid("Header-login")).click();

    cy.title().should("eq", "Neufund Platform");
  });
});
