import { confirmAccessModal, goToProfile } from "./index";
import { tid } from "./selectors";

const extractSeedFromDOM = (seed: string): string[] =>
  seed
    .replace(/\d/g, "")
    .replace(/[.]/g, " ")
    .split(" ");

const extractRandomWordIndexFromDOM = (indexArray: string): string[] =>
  indexArray.replace(/[a-z]/g, "").split(" ");

export const backupLightWalletSeedBase = () => {
  confirmAccessModal();

  cy.get(tid("backup-seed-intro-button")).awaitedClick();

  cy.get(tid("seed-display-word")).then(word => {
    const firstSeed = extractSeedFromDOM(word.text());
    firstSeed.shift();

    const seed = firstSeed;
    cy.get(tid("seed-display-next-link")).awaitedClick();

    cy.get(tid("seed-verify-label")).then(randomWords => {
      const randomEnt = extractRandomWordIndexFromDOM(randomWords.text());
      randomEnt.shift();
      for (let index = 0; index < 4; index++) {
        cy.get(`${tid(`backup-seed-verify-word-${index}`)} input`)
          .type(seed[Number.parseInt(randomEnt[index], 10) - 1], { force: true, timeout: 20 })
          .type("{enter}");
      }

      cy.get(tid("seed-verify-button-next")).awaitedClick();
      cy.get(tid("generic-modal-dismiss-button")).awaitedClick();
    });
  });
};

export const backupLightWalletSeed = () => {
  goToProfile();
  cy.get(tid("backup-seed-widget-link-button")).awaitedClick();
  backupLightWalletSeedBase();
  goToProfile();
  cy.get(tid("backup-seed-verified-section")).should("exist");
};

export const backupLightWalletSeedFromAccountSetupDashboard = () => {
  cy.get(tid("backup-seed-widget-link-button")).awaitedClick();
  backupLightWalletSeedBase();
  cy.get(tid("account-setup-start-kyc-section")).should("exist");
};
