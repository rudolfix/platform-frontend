import { INV_EUR_ICBM_HAS_KYC_ADDRESS, INV_EUR_ICBM_HAS_KYC_SEED } from "../fixtures";
import {
  addPendingExternalTransaction,
  closeModal,
  goToDashboard,
  removePendingExternalTransaction,
  tid,
} from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertPendingWithdrawModal, assertSuccessWithdrawModal, doWithdraw } from "./utils";

describe("Pending Transactions In Header", () => {
  it("should show no pending transaction icon", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });
  });

  it("should open pending transaction monitor when there is a pending transaction", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const address = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
      const amount = "10";

      doWithdraw(address, amount, { closeWhen: "pending" });

      // assert correct behavior of transaction monitor
      cy.get(tid("pending-transactions-status.mining")).click();

      assertPendingWithdrawModal(address, amount);

      assertSuccessWithdrawModal(address, amount);

      // after success modal is closed should remove transaction for pending list
      closeModal();
      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });
  });

  it("should not remove transaction that's still pending from the list", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const address = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
      const amount = "10";

      doWithdraw(address, amount, { closeWhen: "pending" });

      cy.get(tid("pending-transactions-status.mining")).click();

      assertPendingWithdrawModal(address, amount);

      closeModal();

      cy.get(tid("pending-transactions-status.mining")).should("exist");
    });
  });

  it("should not remove transaction from pending list after reload when success modal is opened", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const address = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
      const amount = "10";

      doWithdraw(address, amount, { closeWhen: "never" });

      cy.reload();

      cy.get(tid("pending-transactions-status.success")).click();

      assertSuccessWithdrawModal(address, amount);
    });
  });

  it("should open pending transaction monitor when there is a success transaction", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const address = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
      const amount = "10";

      doWithdraw(address, amount, { closeWhen: "pending" });

      cy.get(tid("pending-transactions-status.mining")).should("not.exist");

      // when mined should show success modal
      cy.get(tid("pending-transactions-status.success")).click();

      assertSuccessWithdrawModal(address, amount);

      // after success modal is closed should remove transaction for pending list
      closeModal();
      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });
  });

  it("should remove transaction from pending list after success", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const address = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
      const amount = "10";

      doWithdraw(address, amount, { closeWhen: "success" });

      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });
  });

  it("external pending transaction should not affect header icon", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      addPendingExternalTransaction(INV_EUR_ICBM_HAS_KYC_ADDRESS);

      goToDashboard();

      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");

      removePendingExternalTransaction();
    });
  });

  // TODO: Add test for tx error case like `should remove transaction from pending list after success`

  // TODO: Add test for tx error case like `should open pending transaction monitor when there is a success transaction`
});
