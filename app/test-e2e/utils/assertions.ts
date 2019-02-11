import { get } from "lodash";

import { appRoutes } from "../../components/appRoutes";
import { walletRegisterRoutes } from "../../components/wallet-selector/walletRoutes";
import { mockApiUrl } from "../confirm";
import { tid } from "./selectors";

export const assertEtoDashboard = () => {
  cy.url().should("contain", "/dashboard");
  cy.get(tid("eto-dashboard-application")).should("exist");
};

export const assertEtoDocuments = () => {
  cy.url().should("contain", "/documents");
  cy.get(tid("eto-documents")).should("exist");
};

export const assertDashboard = () => {
  cy.url().should("contain", "/dashboard");
  cy.get(tid("dashboard-application")).should("exist");
};

export const assertRegister = () => {
  cy.url().should("contain", walletRegisterRoutes.light);
  cy.get(tid("register-layout")).should("exist");
};

export const assertPortfolio = () => {
  cy.url().should("contain", "/portfolio");
  cy.get(tid("portfolio-layout")).should("exist");
};

export const assertWallet = () => {
  cy.url().should("contain", "/wallet");
  cy.get(tid("wallet-start-container")).should("exist");
};

export const assertWaitForLatestEmailSentWithSalt = (
  userEmail: string,
  timeout: number = 20000,
) => {
  expect(timeout, `Email not received in ${timeout} ms`).to.be.gt(0);
  cy.wait(1000);
  cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "GET" }).then(r => {
    if (r.status === 200) {
      const response = get(r, "body[0].personalizations[0].to[0]");
      if (response) {
        const loginLink = get(r, "body[0].personalizations[0].substitutions.-loginLink-");
        expect(response.email).to.be.eq(userEmail);
        expect(loginLink).to.contain("salt");
        return;
      }
    }
    assertWaitForLatestEmailSentWithSalt(userEmail, timeout - 1000);
  });
};

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

export const assertButtonIsActive = (id: string) => {
  return cy.get(tid(id)).should("be.not.disabled");
};

export const assertLockedAccessModal = () => {
  cy.get(tid("access-light-wallet-locked")).should("exist");
};

export const assertUserInDashboard = (isIssuer: boolean = false) => {
  cy.url().should("contain", appRoutes.dashboard);
  return isIssuer ? cy.get(tid("eto-dashboard-application")) : cy.get(tid("dashboard-application"));
};

export const assertUserInLanding = () => {
  cy.url().should("contain", appRoutes.root);
  return cy.get(tid("landing-page"));
};

export const assertMoneyNotEmpty = (selector: string) => {
  cy.get(tid(selector)).then($element => {
    const value = $element.text();

    expect(value).to.not.equal("-");
  });
};
