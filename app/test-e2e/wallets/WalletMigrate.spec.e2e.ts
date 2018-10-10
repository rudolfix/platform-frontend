import { getNonceRpc } from "./../utils/ethRpcUtils";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { tid, assertDashboard } from "../utils";
import web3Accounts from "web3-eth-accounts";
import { getChainIdRpc, sendRawTransactionRpc, getTransactionReceipt } from "../utils/ethRpcUtils";
import { charRegExPattern, numberRegExPattern } from "../utils/index";

const NODE_ADDRESS = "https://localhost:9090/node";

describe("Auto Login", () => {
  beforeEach(() =>
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
      seed:
        "cattle cash squirrel fee confirm thumb armor wisdom author eternal apart mass hawk hover sign must beef improve sketch kite lesson pumpkin exist pattern",
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
      const to = toField.text().replace(charRegExPattern, "");

      cy.get(tid("modals.icbm-balance-modal.migrate-body.gas-limit")).then(gasLimitField => {
        const gas = gasLimitField.text().replace(charRegExPattern, "");

        cy.get(tid("modals.icbm-balance-modal.migrate-body.input-data")).then(inputDataField => {
          const data = inputDataField.text().replace(charRegExPattern, "");
          getNonceRpc(NODE_ADDRESS, "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3").then(nonce => {
            getChainIdRpc(NODE_ADDRESS).then(chainId => {
              account
                .signTransaction({
                  to,
                  value: "0",
                  gas,
                  data,
                  gasPrice: "1",
                  nonce: nonce.body.result,
                  chainId: chainId.body.result,
                })
                .then((signed: any) => {
                  cy.log("Sending First Transaction");
                  sendRawTransactionRpc(NODE_ADDRESS, signed.rawTransaction).then(hash => {
                    // Wait for transaction to get conducted
                    cy.wait(1000);
                    getTransactionReceipt(NODE_ADDRESS, hash.body.result).then(receipt => {
                      cy.get(tid("modals.icbm-balance-modal.migrate-body.step-2"));

                      cy.get(tid("modals.icbm-balance-modal.migrate-body.to")).then(toField => {
                        const to = toField.text().replace(charRegExPattern, "");

                        cy.get(tid("modals.icbm-balance-modal.migrate-body.gas-limit")).then(
                          gasLimitField => {
                            const gas = gasLimitField.text().replace(charRegExPattern, "");

                            cy.get(tid("modals.icbm-balance-modal.migrate-body.input-data")).then(
                              inputDataField => {
                                const data = inputDataField.text().replace(charRegExPattern, "");
                                getNonceRpc(
                                  NODE_ADDRESS,
                                  "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3",
                                ).then(nonce => {
                                  getChainIdRpc(NODE_ADDRESS).then(chainId => {
                                    account
                                      .signTransaction({
                                        to,
                                        value: "0",
                                        gas,
                                        data,
                                        gasPrice: "1",
                                        nonce: nonce.body.result,
                                        chainId: chainId.body.result,
                                      })
                                      .then((signed: any) => {
                                        sendRawTransactionRpc(
                                          NODE_ADDRESS,
                                          signed.rawTransaction,
                                        ).then(hash => {
                                          // Wait for transaction to get conducted
                                          cy.wait(1000);
                                          getTransactionReceipt(
                                            NODE_ADDRESS,
                                            hash.body.result,
                                          ).then(receipt => {
                                            cy.get(
                                              tid("modals.icbm-balance-modal.migrate-body.step-2"),
                                            );
                                          });
                                        });
                                      });
                                  });
                                });
                              },
                            );
                          },
                        );
                      });
                    });
                  });
                });
            });
          });
        });
      });
    });
  });
});
