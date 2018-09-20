import BigNumber from "bignumber.js";

import { tid } from "../../../../../test/testUtils";
import {
  assertUserInDashboard,
  numberRegExPattern,
  typeLightwalletRecoveryPhrase,
} from "../../../../e2e-test-utils";
import { getTransactionReceiptRpc } from "../../../../e2e-test-utils/ethRpcUtils";
import { recoverRoutes } from "../../../walletSelector/walletRecover/recoverRoutes";

/* to be used later const Q18 = new BigNumber(10).pow(18); */
const GIGA_WEI = 1000000000;
const NODE_ADDRESS = "https://localhost:9090/node";

describe("Wallet Withdraw", () => {
  it("should recover existing user with verified email from saved phrases and change email", () => {
    //@see https://github.com/Neufund/platform-backend/tree/master/deploy#dev-fixtures
    const words = [
      "juice",
      "chest",
      "position",
      "grace",
      "weather",
      "matter",
      "turn",
      "delay",
      "space",
      "abuse",
      "winter",
      "slice",
      "tell",
      "flip",
      "use",
      "between",
      "crouch",
      "shop",
      "open",
      "leg",
      "elegant",
      "bracket",
      "lamp",
      "day",
    ];

    const email = "john-smith@example.com";
    const testValue = (10).toString();
    const expectedGasLimit = "0x24000";
    const expectedInput =
      "0xbe45fd620000000000000000000000007d50356afc0535932d3bbafd515459bc92c894800000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    const expectedAddress = "0x7D50356afC0535932d3Bbafd515459Bc92c89480";
    const expectedInputValue = "0";

    cy.visit(`${recoverRoutes.seed}`);

    typeLightwalletRecoveryPhrase(words);

    cy.get(tid("wallet-selector-register-email")).type(email);
    cy.get(tid("wallet-selector-register-password")).type("strongpassword");
    cy.get(tid("wallet-selector-register-confirm-password")).type("strongpassword{enter}");
    cy.get(tid("recovery-success-btn-go-dashboard")).click();

    assertUserInDashboard();
    cy.get(tid("authorized-layout-wallet-button")).click();
    cy.get(tid("account-address.your.ether-address.div")).then(accountAddress => {
      cy.get(tid("wallet-balance.ether.shared-component.withdraw.button")).click();
      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.to-address")).type(
        expectedAddress,
      );
      cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).type(testValue);
      cy.get(tid("modals.tx-sender.withdraw-flow.gwei-formatter-component.gas-price")).then(
        gasPrice => {
          const expectedGasPrice = gasPrice.text().match(numberRegExPattern) || ["0"];
          cy.get(
            tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"),
          ).click();

          cy.get(tid("modals.tx-sender.withdraw-flow.summery.withdrawSummery.accept")).click();
          cy.get(tid("access-light-wallet-prompt-accept-button")).click();
          cy.get(tid("modals.shared.signing-message.modal"));
          cy.get(tid("modals.tx-sender.withdraw-flow.success"));

          cy.get(tid("modals.tx-sender.withdraw-flow.tx-hash")).then(txHashObject => {
            getTransactionByHashRpc(NODE_ADDRESS, txHashObject.text()).then(data => {
              const { from, gas, gasPrice, input, hash, value } = data.body.result;

              const ethValue = new BigNumber(value).toString();
              const ethGasPrice = new BigNumber(gasPrice).div(GIGA_WEI).toString();

              expect(from).to.equal(accountAddress.text().toLowerCase());
              expect(txHashObject.text()).to.equal(hash);
              expect(ethGasPrice).to.equal(expectedGasPrice[0]);
              expect(input).to.equal(expectedInput);
              expect(gas).to.equal(expectedGasLimit);
              expect(ethValue).to.equal(expectedInputValue);

              // TODO: Connect artifacts with tests to get deterministic addresses
              // expect(etherTokenAddress).to.equal(to);

              /* Currently only ether tokens are transferred instead of real tokens this part will be disabled until 
                 We find out how to send real ether

                getBalanceRpc(NODE_ADDRESS, expectedAddress).then(balance => {
                const receivedEtherValue = new BigNumber(balance.body.result).toString();
                expect(receivedEtherValue).to.equal(Q18.mul(testValue).toString());
              }); */
            });
          });
        },
      );
    });
  });
});
