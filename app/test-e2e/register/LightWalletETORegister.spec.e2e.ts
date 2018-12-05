import { assertErrorModal, assertEtoDashboard, registerWithLightWalletETO } from "../utils";

describe("Wallet backup e2e recovery phrase", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });
  it("should register user with light-wallet", () => {
    registerWithLightWalletETO("moe-wallet-backup-e2e@test.com", "strongpassword");

    assertEtoDashboard();
  });

  it("should raise an error that user is already used", () => {
    registerWithLightWalletETO("0xE6Ad2@neufund.org", "strongpassword", false);

    assertErrorModal();
  });
});
