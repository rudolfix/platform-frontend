import { getNonceRpc } from "./../utils/ethRpcUtils";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { tid, assertDashboard } from "../utils";
import web3Accounts from "web3-eth-accounts";
import { getChainIdRpc, sendRawTransactionRpc } from "../utils/ethRpcUtils";

const NODE_ADDRESS = "https://localhost:9090/node";

describe("Auto Login", () => {
  beforeEach(() =>
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }));

  it("will auto login", () => {
    const privKeyHex = "0x79177f5833b64c8fdcc9862f5a779b8ff0e1853bf6e9e4748898d4b6de7e8c93";
    const account = new web3Accounts().privateKeyToAccount(privKeyHex);

    cy.visit("/settings");
    // just a basic check wether the dashboard is working
    // assertDashboard();
    cy.get(tid("models.settings.icbm-wallet-widget.check-your-icbm-wallet-widget.address")).type(
      "0x429123b08df32b0006fd1f3b0ef893a8993802f3{enter}",
    );

    cy.get(tid("modals.icbm-balance-modal.balance-footer.generate-transaction"))
      .wait(2000)
      .click();
    cy.get(tid("modals.icbm-balance-modal.migrate-body.to")).then(toField => {
      const to = toField.text();

      cy.get(tid("modals.icbm-balance-modal.migrate-body.gas-limit")).then(gasLimitField => {
        const gas = gasLimitField.text();

        cy.get(tid("modals.icbm-balance-modal.migrate-body.input-data")).then(inputDataField => {
          const data = inputDataField.text();
          console.log(to);
          getNonceRpc(NODE_ADDRESS, "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3").then(nonce => {
            getChainIdRpc(NODE_ADDRESS).then(chainId => {
              account
                .signTransaction({
                  to: "0x31f7863cd750ad01287db522e322ad7186acf7c7",
                  value: "0",
                  gas: 200000,
                  data:
                    "0x9d5e3c5e0000000000000000000000000009c1d95c547d53e3b962059be11802b5e85ba3",
                  gasPrice: "1",
                  nonce,
                  chainId,
                })
                .then((signed: any) => {
                  sendRawTransactionRpc(NODE_ADDRESS, signed.rawTransaction);
                  console.log(signed);
                });
            });
          });
        });
      });
    });
  });
});
