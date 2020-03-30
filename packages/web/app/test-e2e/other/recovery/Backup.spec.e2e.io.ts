import { LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME } from "../../../config/constants";
import { backupLightWalletSeed } from "../../utils/backupLightWalletSeed";
import {
  accountFixturePrivateKey,
  assertLockedAccessModal,
  confirmAccessModal,
  generateRandomEmailAddress,
  goToProfile,
  loginFixtureAccount,
  registerWithLightWallet,
  tid,
} from "../../utils/index";
import { DEFAULT_PASSWORD } from "./../../utils/constants";

describe("Backup Seed and Private Key save and view", function(): void {
  it("should allow to save seed phrase #backup #p3", () => {
    registerWithLightWallet(generateRandomEmailAddress(), DEFAULT_PASSWORD);
    backupLightWalletSeed();
  });

  it("should prompt for an access after password cache expire #backup #p3", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED");
    goToProfile();

    cy.get(tid("backup-seed-verified-section.view-again")).awaitedClick();

    confirmAccessModal();

    cy.wait(LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME);

    assertLockedAccessModal();
  });

  it.skip("should allow to copy private key #backup #p3", () => {
    // Temporary skip this test, due of issues related to Cypress run on top of Chrome
    // https://github.com/cypress-io/cypress/issues/2752
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED");
    goToProfile();

    cy.get(tid("backup-seed-verified-section.view-again")).awaitedClick();

    confirmAccessModal();

    cy.get(tid("backup-seed-intro-button")).awaitedClick();

    cy.get(tid("private-key-display.copy-to-clipboard")).awaitedClick();

    // it's not possible to check clipboard content in cypress so only check whether notification was shown
    cy.get(tid("private-key-display-copied-to-clipboard"));
  });

  it("should allow to view private key #backup #p3", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED");
    goToProfile();

    cy.get(tid("backup-seed-verified-section.view-again")).awaitedClick();

    confirmAccessModal();

    cy.get(tid("backup-seed-intro-button")).awaitedClick();

    cy.get(tid("private-key-display.view-private-key")).awaitedClick();
    cy.get(tid("private-key-display.content")).then(element => {
      expect(element.text().toUpperCase()).to.be.equal(
        accountFixturePrivateKey("INV_EUR_ICBM_HAS_KYC_SEED")
          .substring(2)
          .toUpperCase(),
      );
    });
  });
});
