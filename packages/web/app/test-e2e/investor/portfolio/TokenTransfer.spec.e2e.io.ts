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

export const NeumarkContract: any = require("../../../../../../git_modules/platform-contracts-artifacts/localhost/contracts/Neumark.json");

const continueTokenFlow = (etoId: string, uniqueFlowSteps: () => void) => {
  cy.get(tid(`modals.portfolio.portfolio-assets.send-token-${etoId}`)).click();
  uniqueFlowSteps();
  assertWithdrawButtonIsDisabled();
  cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
    .should("be.enabled")
    .click();

  cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

  confirmAccessModal(DEFAULT_PASSWORD);

  cy.get(tid("modals.shared.signing-message.modal")).should("exist");
  cy.get(tid("modals.shared.tx-success.modal")).should("exist");
};

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

        continueTokenFlow(etoId, () => {
          typeWithdrawForm(testAddress, testValue);
        });

        getTokenBalance(tokenAddress, address).then(balance2 => {
          const transferedAmount = tokenBalance.sub(balance2).toString();
          expect(transferedAmount).to.be.equal(testValue);
        });
      });
    });
  });
  it("should transfer all tokens to new wallet #portfolio #assets #flaky #p3", () => {
    const zeroAmount = "0";
    const toAddress = "0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883";
    const etoId = etoFixtureAddressByName("ETOInClaimState");
    cy.restoreLocalStorage();

    goToPortfolio();
    continueTokenFlow(etoId, () => {
      typeWithdrawForm(toAddress, testValue);
      cy.get(tid("modals.tx-sender.transfer-flow.transfer-component.whole-balance")).click();
    });
    getTokenBalance(tokenAddress, testAddress).then(balance => {
      expect(balance.toString()).to.be.equal(zeroAmount);
    });
  });
});
