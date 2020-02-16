import PrivateKeyProvider from "truffle-privatekey-provider";

import { generateRandomPrivateKey, remove0x } from "../../modules/web3/utils";
import { NODE_ADDRESS } from "../config";
import { goThroughKycCorporateProcess } from "../investor/kyc/utils";
import { backupLightWalletSeedFromAccountSetupDashboard } from "../shared/backupLightWalletSeed";
import {
  assertDashboard,
  confirmAccessModal,
  ethereumProvider,
  registerWithBrowserWalletAndLogin,
  registerWithLightWallet,
  tid,
  verifyLatestUserEmailAccountSetup,
} from "../utils/index";
import { generateRandomEmailAddress } from "../utils/userHelpers";

describe("Onboarding", () => {
  it("will go throught onboarding process for light wallet user", () => {
    const password = "strongpassword";
    const email = generateRandomEmailAddress();

    registerWithLightWallet(email, password);

    cy.get(tid("onboarding")).should("exist");

    cy.get(tid("account-setup-email-unverified-section")).should("exist");

    verifyLatestUserEmailAccountSetup(email);
    cy.get(tid("account-setup-backup-seed-section")).should("exist");

    backupLightWalletSeedFromAccountSetupDashboard();

    cy.get(tid("start-kyc-button")).awaitedClick();
    cy.get(tid("kyc-start-go-to-business")).awaitedClick();
    goThroughKycCorporateProcess();
    confirmAccessModal();
    cy.get(tid("generic-modal-dismiss-button")).awaitedClick();
    cy.get(tid("onboarding-kyc-pending")).should("exist");
  });

  it("will go throught onboarding process for browser wallet user", () => {
    const email = generateRandomEmailAddress();
    const privateKey = generateRandomPrivateKey();
    const privateKeyProvider = new PrivateKeyProvider(remove0x(privateKey), NODE_ADDRESS);

    registerWithBrowserWalletAndLogin(privateKeyProvider);
    assertDashboard();

    cy.get(tid("onboarding")).should("exist");

    cy.get(tid("account-setup-no-email-section")).should("exist");
    cy.get(tid("verify-email-widget.set-email.button")).awaitedClick();
    cy.get(tid("verify-email-widget-form-email-input")).type(email);
    cy.get(tid("verify-email-widget-form-submit")).awaitedClick();

    verifyLatestUserEmailAccountSetup(email);
    cy.get(tid("account-setup-start-kyc-section")).should("exist");

    //email verification link opens in a new window
    // so we have to inject a dummy web3 provider again
    ethereumProvider(privateKeyProvider);
    cy.get(tid("start-kyc-button")).awaitedClick();
    cy.get(tid("kyc-start-go-to-business")).awaitedClick();

    goThroughKycCorporateProcess();
    cy.get(tid("generic-modal-dismiss-button")).awaitedClick();
    cy.get(tid("onboarding-kyc-pending")).should("exist");
  });
});
