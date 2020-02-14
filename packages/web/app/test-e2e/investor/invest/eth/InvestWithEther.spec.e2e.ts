import { Q18 } from "@neufund/shared";
import BigNumber from "bignumber.js";

import { sendEth } from "../../../utils/ethRpcUtils";
import {
  assertButtonIsActive,
  confirmAccessModal,
  etoFixtureAddressByName,
  goToDashboard,
  parseAmount,
} from "../../../utils/index";
import { tid } from "../../../utils/selectors";
import { createAndLoginNewUser, loginFixtureAccount } from "../../../utils/userHelpers";
import { assertInvestmentModal } from "../utils";

describe("ETH", () => {
  it("should invest ETH @investment @p1", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED");

    goToDashboard();

    // click invest now button
    cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
    cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();

    cy.get(tid("invest-modal-eth-field"))
      .clear()
      .type("1.3");

    // wait for calculation to complete
    assertButtonIsActive("invest-modal-invest-now-button");

    cy.get(tid("invest-modal.est-neu-tokens"))
      .then($element => parseAmount($element.text()))
      .as("estimatedReward");

    cy.get(tid("invest-modal-invest-now-button")).click();

    cy.get(tid("invest-modal-summary-confirm-button")).click();

    confirmAccessModal();

    cy.get(tid("investment-flow.success.title")).should("exist");

    cy.get(tid("investment-flow.success.view-your-portfolio")).click();

    cy.get(tid("portfolio-reserved-asset-neu-reward")).then($element => {
      const neuReward = parseAmount($element.text());
      // TODO: this will be super flaky, read NEU balance before test and then add to estimatedReward
      cy.get<BigNumber>("@estimatedReward").then(estimatedReward => {
        // estimated and actual NEU reward can be a little bit different
        // we allow neu reward to differ from estimated 5%
        // TODO: where is the abs() used, it can be negative
        expect(neuReward.minus(estimatedReward)).to.be.bignumber.lessThan(0.05);
      });
    });
  });

  it.skip("should invest all ETH balance @investment @p3 @flaky", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    const value = "2";
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(({ address }) => {
      sendEth("DEPLOYER", address, Q18.mul(value));

      goToDashboard();

      // click invest now button
      cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
      cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();
      cy.get(tid("invest-modal-full-balance-btn")).click();

      // wait for calculation to complete
      assertButtonIsActive("invest-modal-invest-now-button");

      cy.get(tid("invest-modal.est-neu-tokens"))
        .then($element => parseAmount($element.text()))
        .as("estimatedReward");

      cy.get(tid("invest-modal-invest-now-button")).click();

      cy.get(tid("invest-modal-summary-confirm-button")).click();

      confirmAccessModal();

      cy.get(tid("investment-flow.success.title")).should("exist");

      cy.get(tid("investment-flow.success.view-your-portfolio")).click();

      cy.get(tid("portfolio-reserved-asset-neu-reward")).then($element => {
        const neuReward = parseAmount($element.text());
        // TODO: this will be super flaky, read NEU balance before test and then add to estimatedReward
        cy.get<BigNumber>("@estimatedReward").then(estimatedReward => {
          // estimated and actual NEU reward can be a little bit different
          // we allow neu reward to differ from estimated 5%
          // TODO: where is the abs() used, it can be negative
          expect(neuReward.minus(estimatedReward)).to.be.bignumber.lessThan(0.05);
        });
      });
    });
  });

  it("should invest into public sale @investment @p3", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC");
    goToDashboard();

    // click invest now button
    cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
    cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();

    assertInvestmentModal();

    // select ether from icbm wallet
    cy.get(tid("investment-type.selector.ICBM_ETH")).check({ force: true });
    cy.get(tid("invest-modal-eth-field"))
      .clear()
      .type("10");

    // wait for calculation to complete
    assertButtonIsActive("invest-modal-invest-now-button");

    cy.get(tid("invest-modal-invest-now-button")).click();

    cy.get(tid("invest-modal-summary-confirm-button")).click();

    confirmAccessModal();

    cy.get(tid("investment-flow.success.title")).should("exist");
    // TODO check smart contracts balances
  });

  it("should not show non ICBM wallets when it's not allowed by investment @investment @p3", () => {
    const WHITELIST_ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP");
    goToDashboard();

    // verify ETO with disabled ETH wallet
    cy.get(tid(`eto-overview-${WHITELIST_ETO_ID}`)).click();
    // click invest now button
    cy.get(tid(`eto-invest-now-button-${WHITELIST_ETO_ID}`)).click();

    assertInvestmentModal();

    // ETH wallet should be unavailable in this ETO investment
    cy.get(tid("investment-type.selector.ETH")).should("not.exist");

    // close investment modal
    cy.get(tid("modal-close-button")).click();

    goToDashboard();
    // verify ETO with enabled ETH wallet
    cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
    // click invest now button
    cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();

    assertInvestmentModal();

    // ETH wallet should be unavailable in this ETO investment
    cy.get(tid("investment-type.selector.ETH")).should("exist");
    // it should not have enable wallet button
    cy.get(tid("investment-type.selector.ETH.enable-wallet")).should("not.exist");
  });

  it("should not show non ICBM wallets in presale after calculating contribution and refreshing modal @investment @p3", () => {
    const WHITELIST_ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");

    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP");
    goToDashboard();

    // verify ETO with disabled ETH wallet
    cy.get(tid(`eto-overview-${WHITELIST_ETO_ID}`)).click();
    // click invest now button
    cy.get(tid(`eto-invest-now-button-${WHITELIST_ETO_ID}`)).click();

    assertInvestmentModal();

    // ETH wallet should be unavailable in this ETO investment
    cy.get(tid("investment-type.selector.ETH")).should("not.exist");

    cy.get(tid("invest-modal-eth-field"))
      .clear()
      .type("1000");

    // wait for calculation to complete
    assertButtonIsActive("invest-modal-invest-now-button");

    // close investment modal
    cy.get(tid("modal-close-button")).click();

    // click invest now again
    cy.get(tid(`eto-invest-now-button-${WHITELIST_ETO_ID}`)).click();

    assertInvestmentModal();

    // ETH wallet should be unavailable in this ETO investment
    cy.get(tid("investment-type.selector.ETH")).should("not.exist");
  });
});
