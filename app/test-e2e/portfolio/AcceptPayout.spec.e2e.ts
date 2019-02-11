import { INV_ETH_EUR_ICBM_HAS_KYC } from "../fixtures";
import {
  closeModal,
  confirmAccessModal,
  getWalletEthAmount,
  getWalletNEurAmount,
  goToPortfolio,
  parseAmount,
} from "../utils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Investor accept payout", () => {
  it("eth payout", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ETH_EUR_ICBM_HAS_KYC,
      clearPendingTransactions: true,
    }).then(() => {
      getWalletEthAmount("balanceBefore");

      goToPortfolio();

      cy.get(tid(`asset-portfolio.payout-eth`)).within(() => {
        // accept eth payout
        cy.get(tid("asset-portfolio.payout.accept-payout")).click();
      });

      // save eth amount to be claimed
      cy.get(tid("investor-payout.accept-summary.total-payout"))
        .then($element => parseAmount($element.text()))
        .as("amountToBeClaimed");

      // accept summary
      cy.get(tid("investor-payout.accept-summary.accept")).click();

      confirmAccessModal();

      cy.get(tid("investor-payout.accept-success"));

      closeModal();

      cy.get(tid(`asset-portfolio.payout-eth`)).should("not.exist");

      getWalletEthAmount("balanceAfter");

      cy.get<number>("@amountToBeClaimed").then(amount => {
        cy.get<number>("@balanceBefore").then(balanceBefore => {
          cy.get<number>("@balanceAfter").then(balanceAfter => {
            // balance after payout should be increased by the payout amount
            expect(balanceAfter).to.be.closeTo(balanceBefore + amount, 0.01);
          });
        });
      });
    });

    it("nEUR payout", () => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
        seed: INV_ETH_EUR_ICBM_HAS_KYC,
        clearPendingTransactions: true,
      }).then(() => {
        getWalletNEurAmount("balanceBefore");

        goToPortfolio();

        cy.get(tid(`asset-portfolio.payout-eur_t`)).within(() => {
          // accept neur payout
          cy.get(tid("asset-portfolio.payout.accept-payout")).click();
        });

        // save neur amount to be claimed
        cy.get(tid("investor-payout.accept-summary.total-payout"))
          .then($element => parseAmount($element.text()))
          .as("amountToBeClaimed");

        // accept summary
        cy.get(tid("investor-payout.accept-summary.accept")).click();
        confirmAccessModal();
        cy.get(tid("investor-payout.accept-success"));
        closeModal();

        // assert that payout is removed from the list
        cy.get(tid(`asset-portfolio.payout-eur_t`)).should("not.exist");

        getWalletNEurAmount("balanceAfter");

        cy.get<number>("@amountToBeClaimed").then(amount => {
          cy.get<number>("@balanceBefore").then(balanceBefore => {
            cy.get<number>("@balanceAfter").then(balanceAfter => {
              // balance after payout should be increased by the payout amount
              expect(balanceAfter).to.be.closeTo(balanceBefore + amount, 0.1);
            });
          });
        });
      });
    });
  });
});
