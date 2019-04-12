import { convertToBigInt } from "../../utils/Number.utils";
import { INV_ICBM_ETH_M_HAS_KYC_DUP, INV_ICBM_ETH_M_HAS_KYC_DUP_2 } from "../fixtures";
import {
  etoFixtureAddressByName,
  goToPortfolio,
  goToPortfolioWithRequiredPayoutAmountSet,
  tid,
} from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Portfolio", () => {
  describe("Reserved assets", () => {
    it("should populate on initial view", () => {
      const etoId = etoFixtureAddressByName("ETOInPayoutState");

      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
        seed: INV_ICBM_ETH_M_HAS_KYC_DUP,
        hdPath: "m/44'/60'/0'/0",
        clearPendingTransactions: true,
      });

      goToPortfolio();

      cy.get(tid(`portfolio-my-assets-token-${etoId}`)).should("exist");
    });
  });

  describe("Asset portfolio", () => {
    it("should hide ETH in pending payouts", () => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
        seed: INV_ICBM_ETH_M_HAS_KYC_DUP_2,
        hdPath: "m/44'/60'/0'/0",
        clearPendingTransactions: true,
      });

      goToPortfolioWithRequiredPayoutAmountSet(convertToBigInt(5));

      cy.get(tid(`asset-portfolio.payout-eth`)).should("not.exist");
      cy.get(tid(`asset-portfolio.payout-eur_t`)).should("exist");
    });

    it("should hide all pending payouts", () => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
        seed: INV_ICBM_ETH_M_HAS_KYC_DUP_2,
        hdPath: "m/44'/60'/0'/0",
        clearPendingTransactions: true,
      });

      goToPortfolioWithRequiredPayoutAmountSet(convertToBigInt(5000));

      cy.get(tid(`asset-portfolio.no-payouts`)).should("exist");
    });
  });
});
