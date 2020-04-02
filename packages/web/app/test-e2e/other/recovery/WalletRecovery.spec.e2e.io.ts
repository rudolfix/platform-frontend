import { appRoutes } from "../../../components/appRoutes";
import { generateRandomSeedAndAddress } from "../../obsolete/generateRandomSeedAndAddress";
import { cyPromise } from "../../utils/cyPromise";
import {
  assertDashboard,
  assertWaitForLatestEmailSentWithSalt,
  createAndLoginNewUser,
  generateRandomEmailAddress,
  getLatestVerifyUserEmailLink,
  getWalletMetaData,
  goToUserAccountSettings,
  lightWalletTypePasswordRegistration,
  lightWalletTypeRegistrationInfo,
  logoutViaAccountMenu,
  tid,
  typeLightwalletRecoveryPhrase,
} from "../../utils/index";
import { DEFAULT_HD_PATH } from "./../../utils/constants";

describe("Wallet recovery", function(): void {
  it("should show error modal for invalid recovery phrases #backup #p1", () => {
    cy.visit(`${appRoutes.restore + "/seed"}`);

    const wrongMnemonics = "mutual mutual phone brief hedgehog friend brown actual candy will tank case phone rather program clap scrap dog trouble phrase fit section snack world".split(
      " ",
    );

    typeLightwalletRecoveryPhrase(wrongMnemonics);
    cy.get(tid("account-recovery.seed-error")).should("exist");
  });

  it("should recover wallet from saved phrases #backup #p2", () => {
    cyPromise(() => generateRandomSeedAndAddress(DEFAULT_HD_PATH)).then(
      ({ seed: words, address: expectedGeneratedAddress }) => {
        const password = "strongpassword";
        const email = generateRandomEmailAddress();

        cy.visit(`${appRoutes.restore}`);

        typeLightwalletRecoveryPhrase(words);

        lightWalletTypeRegistrationInfo(email, password);

        assertDashboard();
        assertWaitForLatestEmailSentWithSalt(email);

        cy.get(tid("unverified-email-reminder-modal-ok-button")).click();

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

  it("should recover the same account twice #backup #p2", () => {
    cyPromise(() => generateRandomSeedAndAddress(DEFAULT_HD_PATH)).then(
      ({ seed: words, address: expectedGeneratedAddress }) => {
        const password = "strongpassword";
        const email = generateRandomEmailAddress();

        cy.visit(`${appRoutes.restore}`);

        typeLightwalletRecoveryPhrase(words);

        lightWalletTypeRegistrationInfo(email, password);

        assertDashboard();
        assertWaitForLatestEmailSentWithSalt(email);

        cy.get(tid("unverified-email-reminder-modal-ok-button")).click();

        cy.contains(tid("my-neu-widget-neumark-balance.large-value"), "0 NEU");
        cy.contains(tid("my-wallet-widget-eur-token.large-value"), "0 nEUR");
        cy.contains(tid("my-wallet-widget-eur-token.value"), "0 EUR");

        goToUserAccountSettings();
        cy.get(tid("account-address.your.ether-address.from-div")).then(value => {
          expect(value[0].innerText.toLowerCase()).to.equal(expectedGeneratedAddress);
        });

        logoutViaAccountMenu();

        cy.visit(`${appRoutes.restore}`);

        typeLightwalletRecoveryPhrase(words);

        lightWalletTypeRegistrationInfo(email, password);

        assertDashboard();
        assertWaitForLatestEmailSentWithSalt(email);

        cy.get(tid("unverified-email-reminder-modal-ok-button")).click();

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

  it("should return an error when recovering seed and using an already verified email #backup #p3", () => {
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

          cy.get(tid("email-error")).contains("Sorry. This email address is already in use");
          cy.get(tid("wallet-selector-register-button")).should("be.disabled");
        });
      });
    });
  });

  it("should recover user with same email if its the same user #backup #p3", function(): void {
    cyPromise(() => generateRandomSeedAndAddress(DEFAULT_HD_PATH)).then(({ seed }) => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "individual",
        seed: seed.join(" "),
      }).then(() => {
        const password = "strongpassword";
        const { email } = getWalletMetaData();
        cy.clearLocalStorage();
        cy.visit(appRoutes.restore);

        typeLightwalletRecoveryPhrase(seed);
        lightWalletTypePasswordRegistration(password);
        assertDashboard();
        getLatestVerifyUserEmailLink(email);
      });
    });
  });

  it("should recover existing user with verified email from saved phrases and change email #backup #p3 ", function(): void {
    cyPromise(() => generateRandomSeedAndAddress(DEFAULT_HD_PATH)).then(({ seed }) => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "individual",
        seed: seed.join(" "),
      }).then(() => {
        {
          const email = generateRandomEmailAddress();
          const password = "strongpassword";

          cy.clearLocalStorage();
          cy.visit(appRoutes.restore);

          typeLightwalletRecoveryPhrase(seed);

          lightWalletTypeRegistrationInfo(email, password);
          cy.get(tid("unverified-email-reminder-modal-ok-button")).awaitedClick();
          cy.visit("/");
          assertDashboard();
        }
      });
    });
  });
});
