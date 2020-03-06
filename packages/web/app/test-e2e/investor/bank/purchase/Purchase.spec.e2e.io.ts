import { fillForm } from "../../../utils/forms";
import { assertWallet, clearEmailServer, goToProfile, goToWallet } from "../../../utils/index";
import { tid } from "../../../utils/selectors";
import { loginFixtureAccount } from "../../../utils/userHelpers";
import { assertBankAccountDetails } from "../assertions";

function assertBankTransferFlow({
  agreementApprovalRequired,
}: {
  agreementApprovalRequired: boolean;
}): void {
  if (agreementApprovalRequired) {
    fillForm({
      quintessenceTosApproved: {
        type: "checkbox",
        values: { false: true },
      },
      nEurTosApproved: {
        type: "checkbox",
        values: { false: true },
      },
      "bank-verification.agree-with-tos": {
        type: "submit",
      },
    });
  }

  cy.get(tid("bank-transfer.purchase.summary.min-amount")).contains("1 EUR");
  cy.get(tid("bank-transfer.purchase.summary.recipient")).contains("Quintessence AG");
  cy.get(tid("bank-transfer.purchase.summary.iban")).contains("LI78088110102905K002E");
  cy.get(tid("bank-transfer.purchase.summary.bic")).contains("BFRILI22XXX");

  cy.get(tid("bank-transfer.purchase.summary.reference-number"))
    .then($e => $e.text().trim())
    .as("referenceNumber")
    .should("match", /NR[\w\d]{10}NR/);

  cy.get(tid("bank-transfer.purchase.summary.transfer-completed")).click();

  // TODO: Email are not send immediately after moving backend to use queues
  // cy.get<string>("@referenceNumber").then(assertWaitForBankTransferSummary);

  cy.get(tid("bank-transfer.purchase.success.go-to-wallet")).click();

  assertWallet();
}

describe("Purchase", () => {
  beforeEach(() => {
    clearEmailServer();
  });

  it("should start purchase without agreement approval when bank account is verified #banking #p3", () => {
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC_DUP");
    goToWallet();

    cy.get(tid("wallet-balance.neur.purchase-button")).click();

    assertBankTransferFlow({
      agreementApprovalRequired: false,
    });
  });

  it("should show bank account details #banking #p2", () => {
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC_DUP");
    // On wallet
    goToWallet();

    assertBankAccountDetails();

    // On profile
    goToProfile();

    assertBankAccountDetails();
  });
});
