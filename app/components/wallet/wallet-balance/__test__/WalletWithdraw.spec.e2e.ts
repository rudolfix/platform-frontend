import { tid } from "../../../../../test/testUtils";
import {
  assertLatestEmailSentWithSalt,
  assertUserInDashboard,
  mockApiUrl,
  typeLightwalletRecoveryPhrase,
} from "../../../../e2e-test-utils";
import  { getTransactionReceiptRpc } from "../../../../e2e-test-utils/ethRpcUtils";

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
    cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "DELETE" });

    cy.visit("/recover/seed");

    typeLightwalletRecoveryPhrase(words);

    cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "DELETE" });

    cy.get(tid("wallet-selector-register-email")).type(email);
    cy.get(tid("wallet-selector-register-password")).type("strongpassword");
    cy.get(tid("wallet-selector-register-confirm-password")).type("strongpassword{enter}");
    cy.wait(2000);

    cy.get(tid("recovery-success-btn-go-dashboard")).click();

    cy.wait(5000);
    assertLatestEmailSentWithSalt(email);

    assertUserInDashboard();

    cy.get(tid("authorized-layout-wallet-button")).click();
    cy.get(tid("wallet-balance.ether.shared-component.withdraw.button")).click();

    cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.to-address")).type(
      "0x28f1670f55ae9c15fe38bf052cd35edcdb1dab8b",
    );
    cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).type("1");
    cy.get(
      tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"),
    ).click();

    cy.get(tid("modals.tx-sender.withdraw-flow.summery.withdrawSummery.accept")).click();
    cy.get(tid("access-light-wallet-prompt-accept-button")).click();
    cy.get(tid("modals.shared.signing-message.modal"));
    cy.get(tid("modals.tx-sender.withdraw-flow.success"));

    // LOTS OF STUFF
    // Transaction mined i have txReceipt

    cy.get(tid("modals.tx-sender.withdraw-flow.tx-hash")).then(txHashObject => {
      getTransactionReceiptRpc("https://localhost:9090/node", txHashObject.text()).then(data => {
        console.log(data);
      });
    });
  });
});
