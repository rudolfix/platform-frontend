import { getTokenBalance } from "../../utils/ethRpcUtils";
import { confirmAccessModal, etoFixtureAddressByName, etoFixtureByName } from "../../utils/index";
import { goToPortfolio } from "../../utils/navigation";
import { tid } from "../../utils/selectors";
import {
  createAndLoginNewUser,
  DEFAULT_PASSWORD,
  loginFixtureAccount,
} from "../../utils/userHelpers";
import { assertWithdrawButtonIsDisabled, typeWithdrawForm } from "../wallet/utils";

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

  // There is a bug: https://github.com/Neufund/platform-frontend/issues/4179
  it.skip("should allow to transfer all tokens to not verified wallet #portfolio #assets #p3", () => {
    const toAddress = "0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883";
    const etoId = etoFixtureAddressByName("ETOInClaimState");

    loginFixtureAccount("INV_HAS_EUR_HAS_KYC_2");
    goToPortfolio();

    cy.get(tid(`modals.portfolio.portfolio-assets.send-token-${etoId}`)).click();

    cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.to-address"))
      .type(toAddress)
      .blur();

    cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address-with-balance"))
      .should("exist")
      .then($newAddress => {
        $newAddress.click();
      });

    cy.get(tid("modals.shared.tx-transfer.modal"))
      .find(tid("value"))
      .then($span => {
        const balance = $span.text();

        cy.get(tid("modals.tx-sender.transfer-flow.transfer-component.whole-balance")).click();

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).should(
          "have.value",
          balance,
        );
      });

    cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button")).should(
      "be.enabled",
    );
  });
});
