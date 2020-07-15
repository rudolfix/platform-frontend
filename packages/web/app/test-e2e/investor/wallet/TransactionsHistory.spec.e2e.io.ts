import { generateRandomEthereumAddress } from "@neufund/shared-modules";

import { goToWallet, loginFixtureAccount, tid } from "../../utils/index";
import { doWithdraw } from "./pending-transactions/utils";

describe("Transactions History", () => {
  it("should show transaction history #wallet #p2", () => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC");

    goToWallet();

    cy.get(tid("transactions-history-row"))
      .its("length")
      .as("previousLength");

    cy.get(tid("transactions-history-load-more")).click();

    cy.get<number>("@previousLength").then(previousLength => {
      cy.get(tid("transactions-history-row")).should("to.have.length.gt", previousLength);
    });
  });

  it("should open transaction history modal #wallet #p3", () => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC");

    goToWallet();

    cy.get(tid("transactions-history-row"))
      .first()
      .click();

    cy.get(tid("transaction-history-details-modal")).should("exist");
  });

  it("should watch for new transactions #wallet #p3", () => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC");

    // generate withdraw transaction to have new item in tx history list
    const randomAddress: string = generateRandomEthereumAddress();

    doWithdraw(randomAddress, "0.0001", { closeWhen: "pending" }).then(txHash => {
      goToWallet();

      cy.get(tid(`transactions-history-${txHash}`)).should("exist");
    });
  });
});
