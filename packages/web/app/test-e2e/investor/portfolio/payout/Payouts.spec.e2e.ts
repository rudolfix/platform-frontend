import BigNumber from "bignumber.js";

import {
  assertPortfolio,
  closeModal,
  confirmAccessModal,
  etoFixtureAddressByName,
  fillForm,
  getWalletEthAmount,
  getWalletNEurAmount,
  goToPortfolio,
  parseAmount,
} from "../../../utils/index";
import { tid } from "../../../utils/selectors";
import { loginFixtureAccount } from "../../../utils/userHelpers";

describe("Payouts", () => {
  it("should correctly accept all payouts #portfolio #payout #p3", () => {
    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP");
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

    cy.get<BigNumber>("@ethAmountToBeClaimed").then(amount => {
      cy.get<BigNumber>("@balanceEthBefore").then(balanceBefore => {
        getWalletEthAmount().then(balanceAfter => {
          // balance after payout should be increased by the payout amount
          // there can be rounding issue and gas price cost so we assert balance with small delta
          expect(balanceAfter.minus(balanceBefore.plus(amount))).to.be.bignumber.lessThan(0.01);
        });
      });
    });

    cy.get<BigNumber>("@nEurAmountToBeClaimed").then(amount => {
      cy.get<BigNumber>("@balanceNEurBefore").then(balanceBefore => {
        getWalletNEurAmount().then(balanceAfter => {
          // balance after payout should be increased by the payout amount
          // there can be rounding issue so we assert balance with small delta
          expect(balanceAfter.minus(balanceBefore.plus(amount))).to.be.bignumber.lessThan(0.01);
        });
      });
    });
  });

  it("should disable payout when account is not verified #portfolio #payout #p2", () => {
    loginFixtureAccount("INV_ETH_ICBM_NO_KYC");

    goToPortfolio();

    cy.get(tid(`asset-portfolio.payout-eur_t`)).within(() => {
      cy.get(tid("asset-portfolio.payout.accept-payout")).should("be.disabled");
      cy.get(tid("asset-portfolio.payout.redistribute-payout")).should("be.disabled");
    });

    cy.get(tid(`asset-portfolio.payout-eth`)).within(() => {
      cy.get(tid("asset-portfolio.payout.accept-payout")).should("be.disabled");
      cy.get(tid("asset-portfolio.payout.redistribute-payout")).should("be.disabled");
    });

    cy.get(tid("asset-portfolio.payout.accept-all-payouts")).should("be.disabled");
  });

  it("should show message that there are no payouts #portfolio #payout #p3", () => {
    loginFixtureAccount("INV_EMPTY_HAS_KYC");
    goToPortfolio();

    cy.get(tid(`asset-portfolio.no-payouts`)).should("exist");
  });

  it("should show claimed token in My Assets table #portfolio #p2 #flaky", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPayoutState");

    loginFixtureAccount("INV_HAS_EUR_HAS_KYC");

    goToPortfolio();

    cy.get(tid(`modals.portfolio.portfolio-asset-action.claim-${ETO_ID}`)).click({ force: true });

    fillForm(
      {
        readDocuments: {
          type: "toggle",
          checked: true,
        },
      },
      { submit: false },
    );

    cy.get(tid("modals.tx-sender.user-claim-flow.summary.accept")).click();

    confirmAccessModal();

    cy.get(tid("modals.tx-sender.user-claim-flow.success")).should("exist");
    cy.get(tid("modals.tx-sender.user-claim-flow.success.go-to-portfolio")).click();

    assertPortfolio();

    cy.get(tid(`portfolio-reserved-asset-${ETO_ID}`)).should("not.exist");
    cy.get(tid(`portfolio-my-assets-token-${ETO_ID}`)).should("exist");
    cy.get(tid(`past-investments-${ETO_ID}`)).should("exist");
  });
});
