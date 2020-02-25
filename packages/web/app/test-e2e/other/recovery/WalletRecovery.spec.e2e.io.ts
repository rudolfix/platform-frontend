import { appRoutes } from "../../../components/appRoutes";
import { cyPromise } from "../../utils/cyPromise";
import { generateRandomSeedAndAddress } from "../../utils/generateRandomSeedAndAddress";
import {
  acceptTOS,
  assertDashboard,
  assertErrorModal,
  assertWaitForLatestEmailSentWithSalt,
  createAndLoginNewUser,
  DEFAULT_HD_PATH,
  generateRandomEmailAddress,
  getWalletMetaData,
  goToUserAccountSettings,
  lightWalletTypeLoginInfo,
  lightWalletTypeRegistrationInfo,
  logoutViaAccountMenu,
  tid,
  typeLightwalletRecoveryPhrase,
} from "../../utils/index";

describe("Wallet recovery", function(): void {
  this.retries(2);

  it("should show error modal for invalid recovery phrases @backup @p1", () => {
    cy.visit(`${appRoutes.restore + "/seed"}`);

    const wrongMnemonics = "mutual mutual phone brief hedgehog friend brown actual candy will tank case phone rather program clap scrap dog trouble phrase fit section snack world".split(
      " ",
    );

    typeLightwalletRecoveryPhrase(wrongMnemonics);
    cy.get(tid("form.account-recovery.seed-error.error-message")).should("exist");
  });

  it("should recover wallet from saved phrases @backup @p2", () => {
    cyPromise(() => generateRandomSeedAndAddress(DEFAULT_HD_PATH)).then(
      ({ seed: words, address: expectedGeneratedAddress }) => {
        const password = "strongpassword";
        const email = generateRandomEmailAddress();

        cy.visit(`${appRoutes.restore}`);

        typeLightwalletRecoveryPhrase(words);

        lightWalletTypeRegistrationInfo(email, password);

        assertDashboard();
        assertWaitForLatestEmailSentWithSalt(email);

        cy.contains(
          tid("components.modals.generic-modal.title"),
          "Success! Your account was restored",
        );
        cy.get(tid("generic-modal-dismiss-button")).awaitedClick();

        acceptTOS();

        cy.contains(tid("my-neu-widget-neumark-balance.large-value"), "0 NEU");
        cy.contains(tid("my-wallet-widget-eur-token.large-value"), "0 nEUR");
        cy.contains(tid("my-wallet-widget-eur-token.value"), "0 EUR");

        goToUserAccountSettings();
        cy.get(tid("account-address.your.ether-address.from-div")).then(value => {
          expect(value[0].innerText.toLowerCase()).to.equal(expectedGeneratedAddress);
        });
      },
    );
  });

  it("should return an error when recovering seed and using an already verified email @backup @p3", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(() => {
      const metaData = getWalletMetaData();
      cy.clearLocalStorage().then(() => {
        cy.visit(appRoutes.restore);
        cyPromise(() => generateRandomSeedAndAddress(DEFAULT_HD_PATH)).then(({ seed }) => {
          typeLightwalletRecoveryPhrase(seed);
          lightWalletTypeRegistrationInfo(metaData.email, "randomPassword");

          assertErrorModal();
        });
      });
    });
  });

  it("should recover user with same email if its the same user @backup @p3", function(): void {
    cyPromise(() => generateRandomSeedAndAddress(DEFAULT_HD_PATH)).then(({ seed }) => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "individual",
        seed: seed.join(" "),
      }).then(() => {
        const email = generateRandomEmailAddress();
        const password = "strongpassword";
        cy.clearLocalStorage();
        cy.visit(appRoutes.restore);

        typeLightwalletRecoveryPhrase(seed);
        lightWalletTypeRegistrationInfo(email, password);

        cy.wait(4000);
        cy.get(tid("unverified-email-reminder-modal-ok-button")).awaitedClick();
        logoutViaAccountMenu();

        cy.visit(appRoutes.login);
        lightWalletTypeLoginInfo(email, password);
        assertDashboard();
      });
    });
  });
});
