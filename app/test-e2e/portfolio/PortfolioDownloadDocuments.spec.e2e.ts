import { INV_ICBM_ETH_M_HAS_KYC_DUP } from "../fixtures";
import { etoFixtureAddressByName } from "../utils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Download documents from portfolio", () => {
  it("do", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPayoutState");
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
      seed: INV_ICBM_ETH_M_HAS_KYC_DUP,
      hdPath: "m/44'/60'/0'/0",
      clearPendingTransactions: true,
    }).then(() => {
      cy.visit("/portfolio");
      cy.get(tid(`modals.portfolio.portfolio-assets.download-agreements-${PUBLIC_ETO_ID}`))
        .click()
        .then(() => {
          const downloadSelector = tid(
            `modals.portfolio.portfolio-assets.download-agreements-${PUBLIC_ETO_ID}.download`,
          );
          cy.clock().then(clock => {
            cy.get(downloadSelector)
              .first()
              .parent()
              .click()
              .then(() => {
                cy.get(downloadSelector)
                  .first()
                  .parent()
                  .should("be.disabled");
              });

            // restore clock to native to have all sagas invoked
            clock.restore();

            cy.get(downloadSelector)
              .first()
              .parent()
              .should("not.be.disabled");
          });
        });
    });
  });
});
