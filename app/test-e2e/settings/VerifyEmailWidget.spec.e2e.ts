import {
  assertWaitForLatestEmailSentWithSalt,
  assertUserInDashboard,
  assertVerifyEmailWidgetIsInNoEmailState,
  assertVerifyEmailWidgetIsInUnverifiedEmailState,
  assertVerifyEmailWidgetIsInVerfiedEmailState,
  clearEmailServer,
  convertToUniqueEmail,
  registerWithLightWallet,
  verifyLatestUserEmail,
  tid,
  confirmAccessModalNoPW,
} from "../utils";

describe("Verify Email Widget", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });
  it("should change user email after register", () => {
    const firstEmail = "moe-wallet-backup-e2e@test.com";
    const secondEmail = convertToUniqueEmail(firstEmail);
    const password = "strongpassword";

    registerWithLightWallet(firstEmail, password);
    clearEmailServer();
    assertUserInDashboard();

    cy.get(tid("authorized-layout-profile-button")).awaitedClick();
    assertVerifyEmailWidgetIsInUnverifiedEmailState();
    cy.get(tid("verify-email-widget.change-email.button")).awaitedClick();
    assertVerifyEmailWidgetIsInNoEmailState();

    cy.get(tid("verify-email-widget-form-email-input")).type(secondEmail);
    cy.get(tid("verify-email-widget-form-submit")).awaitedClick();

    confirmAccessModalNoPW();

    // Email server takes time before getting the request
    assertWaitForLatestEmailSentWithSalt(secondEmail);
    verifyLatestUserEmail();

    assertVerifyEmailWidgetIsInVerfiedEmailState();
    assertVerifyEmailWidgetIsInUnverifiedEmailState(true);
    assertVerifyEmailWidgetIsInNoEmailState(true);
  });
});
