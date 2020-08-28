import find from "lodash/find";

import { appRoutes } from "../../components/appRoutes";
import { walletLoginRoutes } from "../../components/wallet-selector/WalletSelectorLogin/wallet-routes";
import { getIsUserVerifiedOnBlockchain } from "./ethRpcUtils";
import { tid } from "./selectors";
import { getPendingTransactions } from "./userHelpers";

export const assertIssuerDashboard = () => {
  cy.get(tid("eto-dashboard-application")).should("exist");
  cy.url().should("contain", appRoutes.dashboard);
};

export const assertNomineeDashboard = () => {
  cy.get(tid("nominee-dashboard")).should("exist");
  cy.url().should("contain", appRoutes.dashboard);
};

export const assertEtoDocuments = () => {
  cy.get(tid("eto-documents")).should("exist");
  cy.url().should("contain", appRoutes.documents);
};

export const assertInvestorDashboard = () => {
  cy.get(tid("dashboard-application")).should("exist");
  return cy.url().should("contain", appRoutes.dashboard);
};

export const assertLanding = () => {
  cy.title().should("eq", "Neufund Platform");
  cy.get(tid("landing-page")).should("exist");

  cy.url().should("contain", appRoutes.root);
};

export const assertRegister = () => {
  cy.get(tid("wallet-selector")).should("exist");
  cy.url().should("contain", appRoutes.registerWithLightWallet);
};

export const assertLogin = () => {
  cy.get(tid("wallet-selector")).should("exist");
  cy.url().should("contain", walletLoginRoutes.light);
};

export const assertPortfolio = () => {
  cy.get(tid("portfolio-layout")).should("exist");
  cy.url().should("contain", appRoutes.portfolio);
};

export const assertWallet = () => {
  cy.get(tid("wallet-start-container")).should("exist");
  cy.url().should("contain", appRoutes.wallet);
};

export const assertProfile = () => {
  cy.url().should("contain", "/profile");
  cy.get(tid("eto-profile")).should("exist");
};

export const getLatestEmailByUser = (r: any, email: string) => find(r.body, ["to", email]);

export const assertVerifyEmailWidgetIsInUnverifiedEmailState = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget.unverified-email-state")).should(
    shouldNotExist ? "not.exist" : "exist",
  );
};

export const assertVerifyEmailWidgetIsInNoEmailState = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget.no-email-state")).should(
    shouldNotExist ? "not.exist" : "exist",
  );
};

export const assertVerifyEmailWidgetIsInVerfiedEmailState = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget.verified-email-state")).should(
    shouldNotExist ? "not.exist" : "exist",
  );
};

export const assertEmailActivationWidgetVisible = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.verify-email-widget")).should(shouldNotExist ? "not.exist" : "exist");
};

export const assertBackupSeedWidgetVisible = (shouldNotExist?: boolean) => {
  cy.get(tid("profile.backup-seed-widget")).should(shouldNotExist ? "not.exist" : "exist");
};

export const assertErrorModal = () => {
  cy.get(tid("components.modals.generic-modal.title")).should("exist");
};

export const assertButtonIsActive = (testId: string) =>
  cy.get(tid(testId)).should("be.not.disabled");

export const assertWaitForExternalPendingTransactionCount = (
  count: number,
  timeout: number = 60000,
) => {
  expect(timeout, `External pending transaction count is not equal to ${count}`).to.be.gt(0);

  cy.wait(3000);

  getPendingTransactions().then(response => {
    if (response.filter(t => t.transaction_type === "mempool").length === count) {
      return;
    }

    assertWaitForExternalPendingTransactionCount(count, timeout - 3000);
  });
};

export const assertIsUserVerifiedOnBlockchain = (address: string, timeout: number = 10000) => {
  expect(timeout, `User not marked as verified on blockchain in ${timeout} ms`).to.be.gt(0);

  // TODO: Replace by proper call to universe smart contract
  const identityRegistryAddress = "0xb48d3d68435e93e760c266df284405c9f637b331";

  getIsUserVerifiedOnBlockchain(identityRegistryAddress, address).then(isVerified => {
    if (!isVerified) {
      const waitTime = 300;

      cy.wait(waitTime);

      assertIsUserVerifiedOnBlockchain(address, timeout - waitTime);
    }
  });
};

export const assertLockedAccessModal = () => {
  cy.get(tid("access-light-wallet-locked")).should("exist");
};

export const assertMoneyNotEmpty = (testId: string) => {
  cy.get(tid(testId)).then($element => {
    const value = $element.text();

    expect(value).to.not.equal("-");
  });
};

export const assertEmailChangeFlow = (): void => {
  cy.get(tid("verify-email-widget.change-email.button")).click();

  cy.get(tid("verify-email-widget-form-email-input")).should("exist");
};

export const assertEmailPendingChange = (email: string, newEmail: string): void => {
  cy.get(tid("profile-email-change-success")).should("exist");
  cy.get(tid("profile.verify-email-widget.verified-email")).contains(email);
  cy.get(tid("profile.verify-email-widget.unverified-email")).contains(newEmail);
};

export const assertEmailChangeAbort = (email: string): void => {
  cy.get(tid("profile-email-change-aborted")).should("exist");
  cy.get(tid("profile.verify-email-widget.verified-email")).contains(email);
  cy.get(tid("profile.verify-email-widget.unverified-email")).should("not.exist");
};

export const assertUserInLightWalletLoginPage = () => {
  cy.get(tid("modals.wallet-selector.login-light-wallet"));
};

export const assertUserInLightWalletRegisterPage = () => {
  cy.get(tid("modals.wallet-selector.register-restore-light-wallet.title"));
};

export const assertUserInRecoveryPage = () => {
  cy.get(tid("recover-layout"));
  cy.url().should("contain", appRoutes.restore);
};

export const assertUserInBrowserWalletLoginPage = () => {
  cy.get(tid("browser-wallet-error-msg"));
};

export const assertUserInLedgerWalletLoginPage = () => {
  cy.get(tid("wallet-selector.login.ledger"));
};

/**
 * Assert that element is an external link (the link that opens in a new tab)
 * @note We are not able to check `target="_blank"` as for cypress run we remove `target` attribute
 * (see `ExternalLink` component implementation for details)
 */
export const assertIsExternalLink = (
  testId: string,
  context: Cypress.Chainable<JQuery<unknown>> = cy.get("body"),
) => {
  context
    .find(tid(testId))
    .get(tid("shared.links.external-link"))
    .should("exist");
};

export const assertTxErrorDialogueNoCost = () => {
  cy.get(tid("modals.shared.tx-error.modal")).should("exist");

  cy.get(tid("modals.tx-sender.withdraw-flow.summary.cost.large-value")).should("not.exist");
};

export const assertTxErrorDialogueWithCost = () => {
  cy.get(tid("modals.shared.tx-error.modal")).should("exist");

  cy.get(tid("modals.tx-sender.withdraw-flow.summary.cost.large-value")).contains(/0\.\d{4}/);
};
