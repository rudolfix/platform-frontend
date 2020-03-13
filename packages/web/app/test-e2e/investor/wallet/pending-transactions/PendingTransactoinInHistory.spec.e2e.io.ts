import { generalPendingTxFixture } from "../../../../modules/tx/utils";
import {
  addPendingTransactions,
  clearPendingTransactions,
  goToWallet,
  tid,
} from "../../../utils/index";
import { createAndLoginNewUser } from "../../../utils/userHelpers";

describe("Pending Transactions In Header", () => {
  let userAddress: string;
  before(() => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(({ address }) => {
      cy.saveLocalStorage();
      userAddress = address;
    });
  });
  beforeEach(() => {
    cy.restoreLocalStorage();
    goToWallet();
  });
  describe("Pending transactions component in transactions history", () => {
    it("should show pending transaction component when there is pending transaction #wallet #p3", () => {
      cy.get(tid("pending-transactions.transaction-mining")).should("not.exist");

      addPendingTransactions(generalPendingTxFixture(userAddress));

      cy.get(tid("pending-transactions.transaction-mining")).should("exist");

      clearPendingTransactions();

      cy.get(tid("pending-transactions.transaction-mining")).should("not.exist");
    });
  });
});
