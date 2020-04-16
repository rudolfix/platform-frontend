import { Q18 } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

import { ETxSenderState } from "../../../../modules/tx/sender/reducer";
import { generalPendingTxFixture } from "../../../../modules/tx/utils";
import { sendEth } from "../../../utils/ethRpcUtils";
import {
  addFailedPendingTransactions,
  addPendingExternalTransaction,
  addPendingTransactions,
  assertTxErrorDialogueNoCost,
  clearPendingTransactions,
  closeModal,
  goToDashboard,
  goToWallet,
  removePendingExternalTransaction,
  tid,
} from "../../../utils/index";
import { createAndLoginNewUser } from "../../../utils/userHelpers";
import { assertPendingWithdrawModal, doWithdraw } from "./utils";

describe("Pending Transactions In Header", () => {
  let userAddress: string;
  const testAddress = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
  const amount = "1";
  before(() => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(({ address }) => {
      cy.saveLocalStorage();
      userAddress = address;
      sendEth("DEPLOYER", address, Q18.mul(amount));
    });
  });
  beforeEach(() => {
    cy.restoreLocalStorage();
    goToWallet();
  });
  describe("Tests that Mock the Pending Transactions", () => {
    it("should show no pending transaction icon #wallet #p3", () => {
      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });

    it("should open pending transaction monitor when there is a pending transaction and Keep pending #wallet #p3", () => {
      addPendingTransactions(generalPendingTxFixture(userAddress));

      cy.get(tid("pending-transactions-status.mining")).click();

      assertPendingWithdrawModal(testAddress, amount);
    });

    it("should not remove transaction that's still pending from the list #wallet #p3", () => {
      addPendingTransactions(generalPendingTxFixture(userAddress));

      cy.get(tid("pending-transactions-status.mining")).click();

      assertPendingWithdrawModal(testAddress, amount);

      closeModal();

      cy.get(tid("pending-transactions-status.mining")).should("exist");
    });

    it("should not remove transaction from pending list after reload when success modal is opened #wallet #p3", () => {
      addPendingTransactions(generalPendingTxFixture(userAddress, ETxSenderState.DONE));
      cy.get(tid("pending-transactions-status.success")).click();

      cy.reload();

      cy.get(tid("pending-transactions-status.success")).click();
    });

    it("should open pending transaction monitor when there is a success transaction #wallet #p3", () => {
      addPendingTransactions(generalPendingTxFixture(userAddress, ETxSenderState.DONE));

      cy.get(tid("pending-transactions-status.mining")).should("not.exist");

      // when mined should show success modal
      cy.get(tid("pending-transactions-status.success")).click();

      closeModal();
      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });

    it("should open pending transaction monitor when there is a failed transaction #wallet #p3", () => {
      addPendingTransactions(generalPendingTxFixture(userAddress, ETxSenderState.ERROR_SIGN));

      cy.get(tid("pending-transactions-status.mining")).should("not.exist");

      // when mined should show success modal
      cy.get(tid("pending-transactions-status.error")).click();

      closeModal();
      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });

    it("should test failed transaction #wallet #p3", () => {
      const txHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
      const tx = generalPendingTxFixture(userAddress);

      addPendingTransactions(tx);

      goToWallet();

      cy.reload();

      cy.get(tid("pending-transactions-status.mining")).should("exist");

      addFailedPendingTransactions(userAddress, txHash, "ERROR MARK");

      cy.get(tid("pending-transactions-status.error"))
        .should("exist")
        .click();

      assertTxErrorDialogueNoCost();
    });

    it("external pending transaction should not affect header icon #wallet #p3", () => {
      clearPendingTransactions();

      addPendingExternalTransaction(userAddress);

      goToDashboard();

      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");

      removePendingExternalTransaction();
    });
  });

  describe("Tests that conduct a real transaction", () => {
    it("should remove transaction from pending list after success #wallet #p2", () => {
      removePendingExternalTransaction();
      doWithdraw(testAddress, new BigNumber(amount).div("2").toString(), {
        closeWhen: "success",
      });

      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });
  });
  // TODO: Add test for tx error case like `should open pending transaction monitor when there is a success transaction`
});
