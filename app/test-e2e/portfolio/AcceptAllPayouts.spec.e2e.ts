import { INV_ICBM_EUR_M_HAS_KYC } from "../fixtures";
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

it("should correctly accept all payouts", () => {
  createAndLoginNewUser({
    type: "investor",
    kyc: "business",
    seed: INV_ICBM_EUR_M_HAS_KYC,
    clearPendingTransactions: true,
  }).then(() => {
    getWalletEthAmount().as("balanceEthBefore");
    getWalletNEurAmount().as("balanceNEurBefore");

    goToPortfolio();

    // accept all payouts
    cy.get(tid("asset-portfolio.payout.accept-all-payouts")).click();

    // save amounts to be claimed
    cy.get(tid("investor-payout.accept-summary.eth-total-payout"))
      .then($element => parseAmount($element.text()))
      .as("ethAmountToBeClaimed");

    cy.get(tid("investor-payout.accept-summary.eur_t-total-payout"))
      .then($element => parseAmount($element.text()))
      .as("nEurAmountToBeClaimed");

    // accept summary
    cy.get(tid("investor-payout.accept-summary.accept")).click();
    confirmAccessModal();

    // wait for success
    cy.get(tid("investor-payout.accept-success"));
    closeModal();

    // assert that payout is removed from the list
    cy.get(tid(`asset-portfolio.payout-eth`)).should("not.exist");
    cy.get(tid(`asset-portfolio.payout-eur_t`)).should("not.exist");

    cy.get<number>("@ethAmountToBeClaimed").then(amount => {
      cy.get<number>("@balanceEthBefore").then(balanceBefore => {
        getWalletEthAmount().then(balanceAfter => {
          // balance after payout should be increased by the payout amount
          // there can be rounding issue and gas price cost so we assert balance with small delta
          expect(balanceAfter).to.be.closeTo(balanceBefore + amount, 0.01);
        });
      });
    });

    cy.get<number>("@nEurAmountToBeClaimed").then(amount => {
      cy.get<number>("@balanceNEurBefore").then(balanceBefore => {
        getWalletNEurAmount().then(balanceAfter => {
          // balance after payout should be increased by the payout amount
          // there can be rounding issue so we assert balance with small delta
          expect(balanceAfter).to.be.closeTo(balanceBefore + amount, 0.01);
        });
      });
    });
  });
});
