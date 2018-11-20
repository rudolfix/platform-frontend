import { INV_EUR_ICBM_HAS_KYC_SEED } from "../constants";
import { etoFixtureAddressByName } from "../utils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Upgrade icbm wallet", () => {
  it("do", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      clearPendingTransactions: true,
    }).then(() => {
      cy.visit("/wallet");
      cy.get(tid("icbmNeuroWallet.shared-component.upgrade.button")).click();
    });
  });
});
