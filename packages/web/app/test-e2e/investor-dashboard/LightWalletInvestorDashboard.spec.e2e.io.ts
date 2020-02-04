import * as moment from "moment";

import { assertMoneyNotEmpty, etoFixtureByName } from "../utils";
import { goToDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Auto Login", () => {
  it("will auto login", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();
    });
  });
});

// TODO: Find why these tests are flaky
describe("Incoming payout", function(): void {
  this.retries(2);
  it("should show counter with incoming payout value", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();

      cy.get(tid("my-neu-widget-payout-pending"));

      assertMoneyNotEmpty("my-neu-widget-payout-pending-money");
    });
  });

  it.skip("should change view after incoming payout complete", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      let clock: any = null;
      goToDashboard();

      cy.get(tid("incoming-payout-counter"));

      const counterTime = moment()
        .utc()
        .endOf("day")
        .subtract(10, "seconds")
        .toDate()
        .getTime();
      // workaround for not working this.clock.restore() outside clock promise
      cy.clock(counterTime).then(cl => (clock = cl));
      cy.tick(11 * 1000);

      cy.get(tid("incoming-payout-done"));

      cy.get(tid("incoming-payout-go-to-portfolio"))
        .click()
        .then(() => {
          // restore clock to have portfolio loaded
          clock.restore();
        });

      cy.url().should("include", "/portfolio");
    });
  });

  it.skip("Should show the number of investors", () => {
    const eto = etoFixtureByName("ETOInSigningState");
    const ETO_ID = eto.address;
    const numberOfInvestors = Object.keys(eto.investors).length;

    createAndLoginNewUser({ type: "investor" });

    goToDashboard();
    cy.get(tid(`eto-overview-${ETO_ID}-investors-count`))
      .get(tid("value"))
      .contains(numberOfInvestors);
  });
});
