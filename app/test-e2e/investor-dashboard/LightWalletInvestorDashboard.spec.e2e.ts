import * as moment from "moment";

import { assertDashboard, assertMoneyNotEmpty } from "../utils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Auto Login", () => {
  it("will auto login", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      cy.visit("/dashboard");
      // just a basic check wether the dashboard is working
      assertDashboard();
    });
  });
});

describe("Incoming payout", () => {
  it("should show counter with incoming payout value", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      cy.visit("/dashboard");

      cy.get(tid("incoming-payout-counter"));

      assertMoneyNotEmpty("incoming-payout-euro-token");

      assertMoneyNotEmpty("incoming-payout-ether-token");
    });
  });

  it("should change view after incoming payout complete", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      cy.visit("/dashboard");

      cy.get(tid("incoming-payout-counter"));

      const counterTime = moment()
        .utc()
        .endOf("day")
        .subtract(10, "seconds")
        .toDate()
        .getTime();
      cy.clock(counterTime);
      cy.tick(11 * 1000);

      cy.get(tid("incoming-payout-done"));

      cy.get(tid("incoming-payout-go-to-portfolio")).click();
      cy.url().should("include", "/portfolio");
    });
  });
});
