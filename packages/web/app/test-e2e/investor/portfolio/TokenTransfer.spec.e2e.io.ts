import { getTokenBalance } from "../../utils/ethRpcUtils";
import {
  confirmAccessModal,
  etoFixtureAddressByName,
  etoFixtureByName,
  fillForm,
} from "../../utils/index";
import { goToPortfolio } from "../../utils/navigation";
import { tid } from "../../utils/selectors";
import {
  createAndLoginNewUser,
  DEFAULT_PASSWORD,
  loginFixtureAccount,
} from "../../utils/userHelpers";
import { assertWithdrawButtonIsDisabled, typeWithdrawForm } from "../wallet/utils";
import { generateRandomEthereumAddress } from "./../../../modules/web3/utils";

export const NeumarkContract: any = require("../../../../../../git_modules/platform-contracts-artifacts/localhost/contracts/Neumark.json");

describe("Token Transfer", () => {
  // todo: generate random address for new wallet
  let testAddress: string;

  const tokenAddress = etoFixtureByName("ETOInClaimState").equityToken;
  const testValue = "2";

  before(() => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(({ address }) => {
      cy.saveLocalStorage();
      testAddress = address;
    });
  });
  it("should transfer tokens to new wallet #portfolio #assets #p1", () => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC_2").then(({ address }) => {
      getTokenBalance(tokenAddress, address).then(tokenBalance => {
        const etoId = etoFixtureAddressByName("ETOInClaimState");

        goToPortfolio();

        cy.get(tid(`modals.portfolio.portfolio-assets.send-token-${etoId}`)).click();
        typeWithdrawForm(testAddress, testValue);
        assertWithdrawButtonIsDisabled();

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
          .should("be.enabled")
          .click();

        cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

        confirmAccessModal(DEFAULT_PASSWORD);

        cy.get(tid("modals.shared.signing-message.modal")).should("exist");
        cy.get(tid("modals.shared.tx-success.modal")).should("exist");

        getTokenBalance(tokenAddress, address).then(balance2 => {
          const transferedAmount = tokenBalance.sub(balance2).toString();
          expect(transferedAmount).to.be.equal(testValue);
        });
      });
    });
  });
  it("should transfer all tokens to new wallet #portfolio #assets #flaky #p3", () => {
    const zeroAmount = "0";
    const toAddress = generateRandomEthereumAddress();
    const etoId = etoFixtureAddressByName("ETOInClaimState");
    cy.restoreLocalStorage();

    goToPortfolio();

    cy.get(tid(`modals.portfolio.portfolio-assets.send-token-${etoId}`)).click();
    typeWithdrawForm(toAddress, testValue);

    fillForm(
      {
        allowNewAddress: {
          type: "checkbox",
          values: { false: true },
        },
      },
      { submit: false },
    );
    cy.get(tid("modals.tx-sender.transfer-flow.transfer-component.whole-balance")).click();
    cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
      .should("be.enabled")
      .click();

    cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

    confirmAccessModal(DEFAULT_PASSWORD);

    cy.get(tid("modals.shared.signing-message.modal")).should("exist");
    cy.get(tid("modals.shared.tx-success.modal")).should("exist");

    getTokenBalance(tokenAddress, testAddress).then(balance => {
      expect(balance.toString()).to.be.equal(zeroAmount);
    });
  });
});
