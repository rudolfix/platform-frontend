import {
  assertDashboard,
  assertEtoDashboard,
  assertPortfolio,
  assertProfile,
  assertWallet,
} from "./assertions";

export const goToDashboard = (assert = true) => {
  cy.visit("/dashboard");

  if (assert) {
    assertDashboard();
  }
};

export const goToEtoDashboard = () => {
  cy.visit("/dashboard");
  assertEtoDashboard();
};

export const goToProfile = () => {
  cy.visit("/profile");
  assertProfile();
};

export const goToPortfolio = () => {
  cy.visit("/portfolio");
  assertPortfolio();
};

export const goToWallet = () => {
  cy.visit("/wallet");
  assertWallet();
};
