import { INV_EUR_ICBM_HAS_KYC_SEED } from "../constants";
import {
  assertButtonIsActive,
  assertDashboard,
  confirmAccessModal,
  etoFixtureAddressByName,
  goToDashboard,
} from "../utils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

const parseAmount = (amount: string) => parseFloat(amount.replace(" ", ""));

describe("Invest with ethereum", () => {
  it("do", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();
      assertDashboard();

      // click invest now button
      cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();
      cy.get(tid("invest-modal-eth-field"))
        .clear()
        .type("1.3");

      // wait for calculation to complete
      assertButtonIsActive("invest-modal-invest-now-button");

      cy.get(tid("invest-modal.est-neu-tokens"))
        .then($element => parseAmount($element.text()))
        .as("estimatedReward");

      cy.get(tid("invest-modal-invest-now-button")).click();
      cy.get(tid("invest-modal-summary-confirm-button")).click();
      confirmAccessModal();
      cy.get(tid("investment-flow.success.title"));
      cy.get(tid("investment-flow.success.view-your-portfolio")).click();

      cy.get(tid("portfolio-reserved-asset-token-price")).then($element => {
        const neuReward = parseAmount($element.text());

        cy.get<number>("@estimatedReward").then(estimatedReward => {
          // estimated and actual NEU reward can be a little bit different
          // we allow neu reward to differ from estimated 5%
          expect(neuReward).to.be.closeTo(estimatedReward, estimatedReward * 0.05);
        });
      });
    });
  });
});
