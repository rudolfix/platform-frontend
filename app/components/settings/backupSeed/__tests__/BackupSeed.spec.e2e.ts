import { tid } from "../../../../../test/testUtils";
import { registerWithLightWallet } from "../../../walletSelector/light/__tests__/LightWalletRegister.spec.e2e";

describe("Wallet backup recovery phrase", () => {
  it("should recover wallet from saved phrases", () => {
    registerWithLightWallet();

    cy.get(tid("authorized-layout-settings-button")).click();
    cy.get(tid("backup-seed-widget-link-button")).click();
    cy.get(tid("access-light-wallet-prompt-accept-button")).click();
    cy.get(tid("backup-seed-intro-button")).click();
    cy.get(tid("seed-display-word"));
    cy.get(tid("seed-display-word")).then(word => {
      const firstSeed = word
        .text()
        .replace(/\d/g, "")
        .replace(/[.]/g, " ")
        .split(" ");
      firstSeed.shift();
      cy.get(tid("seed-display-next-words")).click();
      cy.get(tid("seed-display-word")).then(words2 => {
        const secondSeed = words2
          .text()
          .replace(/\d/g, "")
          .replace(/[.]/g, " ")
          .split(" ");
        secondSeed.shift();
        const seed = firstSeed.concat(secondSeed);
        cy.get(tid("seed-display-next-link")).click();
        cy.exec(`echo SEED: ${seed}`);
        cy.get(tid("seed-verify-random-words")).then(randomWords => {
          const randomEnt = randomWords.text().split(" ");
          randomEnt.pop();
          for (let index = 0; index < 4; index++) {
            cy
              .get(tid(`backup-seed-verify-word-${index}`, "input"))
              .type(seed[Number.parseInt(randomEnt[index])], { force: true, timeout: 20 })
              .wait(1000)
              .type("{enter}", { force: true });
              cy.exec(`echo WORD${index+1}: ${seed[Number.parseInt(randomEnt[index])]}`);
          }
          cy.get(tid("seed-verify-button-next")).click();
          cy.get(tid("generic-modal-dismiss-button")).click();
          cy.get(tid("backup-seed-verified-section")).should("exist");
        });
      });
    });
  });
});
