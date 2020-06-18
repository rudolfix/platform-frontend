import { Q18 } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

import { generateRandomEthereumAddress } from "../../../../modules/web3/utils";
import { assertTxErrorDialogueNoCost } from "../../../utils/assertions";
import { DEFAULT_PASSWORD } from "../../../utils/constants";
import { getBalanceRpc, sendEth } from "../../../utils/ethRpcUtils";
import { fillForm } from "../../../utils/forms";
import {
  accountFixtureAddress,
  assertTxErrorDialogueWithCost,
  confirmAccessModal,
  goToDashboard,
  parseAmount,
} from "../../../utils/index";
import { goToWallet, goToWalletWithParams } from "../../../utils/navigation";
import { tid } from "../../../utils/selectors";
import { createAndLoginNewUser, loginFixtureAccount } from "../../../utils/userHelpers";
import {
  assertWithdrawButtonIsDisabled,
  assertWithdrawFlow,
  checkTransactionWithRPCNode,
  continueWithdrawFlow,
} from "../utils";

export const SimpleExchangeContract: any = require("../../../../../../../git_modules/platform-contracts-artifacts/localhost/contracts/SimpleExchange.json");
export const EuroTokenContract: any = require("../../../../../../../git_modules/platform-contracts-artifacts/localhost/contracts/EuroToken.json");

describe("Wallet Withdraw", () => {
  let userAddress: string;
  const testValue = "1";
  const testAddress = generateRandomEthereumAddress();
  before(() => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(({ address }) => {
      cy.saveLocalStorage();
      userAddress = address;
      sendEth("DEPLOYER", address, Q18.mul("10"));
    });
  });
  beforeEach(() => {
    cy.restoreLocalStorage();
    goToWallet();
  });
  describe("checks:", () => {
    // THIS TEST IS SKIPPED BECAUSE THE GAS PRICE API ON IO IS CONNECTED TO REAL PRICES
    // THE TEST IS UNSTABLE AS SOMETIMES THE VALUES REFLECTED CANNOT BE CORRECT
    it.skip("should show gas reserve message #wallet #withdraw #p3", () => {
      continueWithdrawFlow(testAddress, new BigNumber(testValue).mul("5").toString());

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.will-empty-wallet")).should(
        "not.exist",
      );

      // Should show warning for whole possible balance used
      cy.get(tid("modals.tx-sender.transfer-flow.transfer-component.whole-balance")).click();

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value"))
        .invoke("val")
        .as("maxValue");

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.will-empty-wallet")).should(
        "exist",
      );

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).clear();

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.will-empty-wallet")).should(
        "not.exist",
      );

      // Should show warning for slightly lower value than whole balance
      cy.get<string>("@maxValue").then(v => {
        const value = parseAmount(v);
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value"))
          .type(value.minus("0.001").toString())
          .blur();
      });

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.will-empty-wallet")).should(
        "exist",
      );

      assertWithdrawButtonIsDisabled();
    });

    it("should not break when address is not provided first #wallet #withdraw #p3", () => {
      cy.get(tid("wallet.eth.withdraw.button")).awaitedClick();

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).type(
        testValue.toString(),
      );

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.to-address")).type(testAddress);

      fillForm(
        {
          allowNewAddress: {
            type: "checkbox",
            values: { false: true },
          },
        },
        { submit: false },
      );

      cy.get(
        tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"),
      ).should("be.enabled");
    });

    it("should not allow to withdraw to smart contract not accepting ether #wallet #withdraw #p3", () => {
      const smartContractAddress = EuroTokenContract.networks["17"].address;

      continueWithdrawFlow(smartContractAddress, testValue);

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.not-accepting-ether")).should(
        "exist",
      );
      assertWithdrawButtonIsDisabled();
    });

    it("should not allow to withdraw to smart contract not accepting ether when user has no ETH-T #wallet #withdraw #p3", () => {
      const smartContractAddress = EuroTokenContract.networks["17"].address;

      cy.get(tid("wallet.eth.withdraw.button")).awaitedClick();
      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.to-address")).type(
        smartContractAddress,
      );

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).type(
        testValue.toString(),
      );

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.not-accepting-ether")).should(
        "exist",
      );
      assertWithdrawButtonIsDisabled();
    });

    it("should allow to withdraw all for specific available amount #wallet #withdraw #p3", () => {
      const verifiedAddress = accountFixtureAddress("ISSUER_BLANK_QA_HAS_KYC");

      continueWithdrawFlow(verifiedAddress, testValue);

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address")).should(
        "not.exist",
      );
      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.verified-user")).should(
        "exist",
      );

      cy.get(tid("modals.tx-sender.transfer-flow.transfer-component.whole-balance")).click();

      fillForm(
        {
          withdrawAll: {
            type: "checkbox",
            values: { false: true },
          },
        },
        { submit: false },
      );

      cy.get(
        tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"),
      ).should("be.enabled");
    });
  });

  describe("withdraw", () => {
    it("should withdraw to new wallet #wallet #withdraw #p1", () => {
      const expectedInput = `0x`;

      continueWithdrawFlow(testAddress, testValue);

      /* Newly created wallet should not have any transactions so we have to accept warnings */
      assertWithdrawButtonIsDisabled();
      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address")).should("exist");

      fillForm(
        {
          allowNewAddress: {
            type: "checkbox",
            values: { false: true },
          },
        },
        { submit: false },
      );

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
        .should("be.enabled")
        .click();

      assertWithdrawFlow(testAddress, testValue, expectedInput, testValue);
    });

    it("should show warning when withdraw to not used wallet #wallet #withdraw #p3", () => {
      const expectedInput = `0x`;
      const randomAddress = generateRandomEthereumAddress();

      continueWithdrawFlow(randomAddress, testValue);

      /* Newly created wallet should not have any transactions so we have to accept warnings */
      assertWithdrawButtonIsDisabled();
      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address")).should("exist");

      fillForm(
        {
          allowNewAddress: {
            type: "checkbox",
            values: { false: true },
          },
        },
        { submit: false },
      );

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
        .should("be.enabled")
        .click();

      assertWithdrawFlow(randomAddress, testValue, expectedInput, testValue);

      goToWallet();
      continueWithdrawFlow(randomAddress, testValue);
      cy.get(
        tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address-with-balance"),
      ).should("exist");
    });

    it("should show message when withdraw to verified platform address #wallet #withdraw #p3", () => {
      const verifiedAddress = accountFixtureAddress("INV_EUR_ICBM_HAS_KYC_SEED");

      goToWallet();
      continueWithdrawFlow(verifiedAddress, testValue);

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address")).should(
        "not.exist",
      );
      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.verified-user")).should(
        "exist",
      );

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
        .should("be.enabled")
        .click();
    });

    it("should allow to withdraw ETH to smart contract accepting ETH #wallet #withdraw #p2", () => {
      const smartContractThatAcceptsEther = SimpleExchangeContract.networks["17"].address;

      const expectedInput = `0x`;

      goToWallet();
      continueWithdrawFlow(smartContractThatAcceptsEther, testValue);

      /* Address is smart contract so we need to accept warnings */
      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.smart-contract")).should(
        "exist",
      );
      fillForm(
        {
          allowSmartContract: {
            type: "checkbox",
            values: { false: true },
          },
        },
        { submit: false },
      );
      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
        .should("be.enabled")
        .click();

      /*Test flow*/

      assertWithdrawFlow(smartContractThatAcceptsEther, testValue, expectedInput, testValue);
    });

    it("should withdraw all #wallet #withdraw #p3", () => {
      goToWallet();
      continueWithdrawFlow(testAddress, "5");

      cy.get(tid("modals.tx-sender.transfer-flow.transfer-component.whole-balance")).click();

      fillForm(
        {
          allowNewAddress: {
            type: "checkbox",
            values: { false: true },
          },
          withdrawAll: {
            type: "checkbox",
            values: { false: true },
          },
        },
        { submit: false },
      );

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
        .should("be.enabled")
        .click();

      cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

      confirmAccessModal(DEFAULT_PASSWORD);

      cy.get(tid("modals.shared.signing-message.modal")).should("exist");
      cy.get(tid("modals.shared.tx-success.modal")).should("exist");

      cy.get(tid("modals.tx-sender.withdraw-flow.tx-hash")).then(txHashObject => {
        const txHash = txHashObject.attr("data-test-hash")!;

        checkTransactionWithRPCNode({ expectedTo: testAddress }, txHash, true);
        getBalanceRpc(userAddress).then(balance => {
          expect(balance.toString()).to.be.equal("0");
        });
      });
    });
  });

  describe("failed", () => {
    it("should show transaction error with cost for mined transaction #wallet #p3", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC");
      goToDashboard();

      const contactAddress = EuroTokenContract.networks["17"].address;

      goToWalletWithParams({
        disableNotAcceptingEtherCheck: true,
      });
      continueWithdrawFlow(contactAddress, testValue);

      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
        .should("be.enabled")
        .click();

      cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

      confirmAccessModal(DEFAULT_PASSWORD);

      cy.get(tid("modals.shared.signing-message.modal")).should("exist");
      assertTxErrorDialogueWithCost();
    });

    it("should show transaction error with no cost for not mined transaction #wallet #p3", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC");
      goToWalletWithParams({
        forceLowGas: true,
      });
      continueWithdrawFlow(testAddress, testValue);

      fillForm(
        {
          allowNewAddress: {
            type: "checkbox",
            values: { false: true },
          },
        },
        { submit: false },
      );
      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
        .should("be.enabled")
        .click();

      cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

      confirmAccessModal(DEFAULT_PASSWORD);

      cy.get(tid("modals.shared.signing-message.modal")).should("exist");
      assertTxErrorDialogueNoCost();
    });

    it.skip("should show transaction error with cost for a reverted transaction due to out of gas #wallet #p3 #flaky", () => {
      // Web3 Throws when using light wallet due to gas limit checks done before broadcasting the transaction
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC");
      goToDashboard();

      const contractAddress = SimpleExchangeContract.networks["17"].address;

      goToWalletWithParams({
        forceStandardGas: true,
      });
      continueWithdrawFlow(contractAddress, testValue);

      fillForm(
        {
          allowSmartContract: {
            type: "checkbox",
            values: { false: true },
          },
        },
        { submit: false },
      );
      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
        .should("be.enabled")
        .click();

      cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

      confirmAccessModal(DEFAULT_PASSWORD);

      cy.get(tid("modals.shared.signing-message.modal")).should("exist");

      assertTxErrorDialogueWithCost();
    });
  });
});
