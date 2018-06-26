import { tid } from "../../../../../test/testUtils";
import { registerWithLightWallet } from "../../../../e2e-test-utils";

const extractSeedFromDOM = (seed: string): string[] =>
  seed
    .replace(/\d/g, "")
    .replace(/[.]/g, " ")
    .split(" ");

const extractRandomWordIndexFromDOM = (indexArray: string): string[] =>
  indexArray.replace(/[a-z]/g, "").split(" ");

const navigateToSettings = () => cy.get(tid("authorized-layout-settings-button")).click();

describe("Wallet backup recovery phrase", () => {
  it("should recover wallet from saved phrases", () => {
    registerWithLightWallet("moe-recover-wallet@test.com", "strongpassword");

    navigateToSettings();

    cy.get(tid("backup-seed-widget-link-button")).click();
    cy.get(tid("access-light-wallet-prompt-accept-button")).click();
    cy.get(tid("backup-seed-intro-button")).click();

    cy.get(tid("seed-display-word")).then(word => {
      const firstSeed = extractSeedFromDOM(word.text());
      firstSeed.shift();
      cy.get(tid("seed-display-next-words")).click();

      cy.get(tid("seed-display-word")).then(words2 => {
        const secondSeed = extractSeedFromDOM(words2.text());
        secondSeed.shift();
        const seed = firstSeed.concat(secondSeed);
        cy.get(tid("seed-display-next-link")).click();

        cy.get(tid("seed-verify-label")).then(randomWords => {
          const randomEnt = extractRandomWordIndexFromDOM(randomWords.text());
          randomEnt.shift();
          for (let index = 0; index < 4; index++) {
            cy
              .get(tid(`backup-seed-verify-word-${index}`, "input"))
              .type(seed[Number.parseInt(randomEnt[index]) - 1], { force: true, timeout: 20 })
              .wait(1000)
              .type("{enter}", { force: true });
          }

          cy.get(tid("seed-verify-button-next")).click();
          cy.get(tid("generic-modal-dismiss-button")).click();

          cy.get(tid("backup-seed-verified-section")).should("exist");
        });
      });
    });
  });
});
