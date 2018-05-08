import { tid } from "../../../../../test/testUtils";

describe("Wallet recover", () => {
  const words: string[] = []; // @todo insert words here

  it("should recover wallet from saved phrases", () => {
    cy.visit("/recover/seed");

    for (let batch = 0; batch < words.length / 4; batch++) {
      for (let index = 0; index < 4; index++) {
        cy
          .get(tid(`seed-recovery-word-${batch * 4 + index}`, "input"))
          .type(words[batch * 4 + index] + "{enter}", { force: true });
      }

      if (batch + 1 < words.length / 4) {
        cy.get(tid("btn-next")).click();
      }
    }

    cy.get(tid("btn-send")).click();

    cy.get(tid("wallet-selector-register-email")).type("john-smith@example.com");
    cy.get(tid("wallet-selector-register-password")).type("strongpassword");
    cy.get(tid("wallet-selector-register-confirm-password")).type("strongpassword{enter}");

    cy.get(tid("recovery-success-btn-go-dashboard")).click();
  });
});
