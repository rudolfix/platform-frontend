import * as moment from "moment";

import { assertMoneyNotEmpty, goToDashboard, tid } from "../../../utils/index";
import { createAndLoginNewUser } from "../../../utils/userHelpers";

describe("Auto Login", () => {
  it("will auto login", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();
    });
  });
});

// tests were flaky due to poor behaviour of backend and
// createAndLoginNewUser not reacting to HTTP status codes
// currently skipped as announe dialogs changes due to new onboarding but tests did not
describe("Incoming payout", function(): void {
  it("should show countdown with incoming payout value #payout #p2 #flaky", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();

      cy.get(tid("my-neu-widget-payout-pending")).should("exist");

      assertMoneyNotEmpty("my-neu-widget-payout-pending");
    });
  });

  it.skip("should change view after incoming payout complete #payout #p3 #flaky", () => {
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
});
