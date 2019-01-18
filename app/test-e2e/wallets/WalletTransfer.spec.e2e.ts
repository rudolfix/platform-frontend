import { createAndLoginNewUser } from "../utils/userHelpers";
import { INV_EUR_ICBM_HAS_KYC_ADDRESS, INV_EUR_ICBM_HAS_KYC_SEED } from "../constants";
import { assertUserInDashboard, goToDashboard } from "../utils";
import { tid } from "../utils/selectors";

describe("Wallet Transfer", () => {
  it("should generate correct qr-code and address", () => {
    createAndLoginNewUser({
      type: "investor",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      onlyLogin: true,
    }).then(() => {
      goToDashboard();
      assertUserInDashboard();

      cy.get(tid("authorized-layout-wallet-button")).awaitedClick();

      cy.get(tid("wallet-balance.ether.shared-component.deposit.button")).awaitedClick();

      cy.fixture("INV_EUR_ICBM_HAS_KYC_ADDRESS.svg", "base64").then((qrCode: string) => {
        cy.get(tid("wallet-balance.ether.deposit.qr-code")).should(
          "have.attr",
          "src",
          `data:image/svg+xml;base64,${qrCode}`,
        );
      });

      cy.get(tid("wallet-balance.ether.deposit.address")).should(
        "have.text",
        INV_EUR_ICBM_HAS_KYC_ADDRESS,
      );
    });
  });
});
