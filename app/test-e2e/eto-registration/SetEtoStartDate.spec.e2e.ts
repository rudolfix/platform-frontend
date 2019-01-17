import * as moment from "moment";

import { appRoutes } from "../../components/appRoutes";
import { ISSUER_SETUP, ISSUER_SETUP_NO_ST } from "../constants";
import { closeModal, confirmAccessModal } from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { tid } from "../utils/selectors";

describe("Eto start date setup", () => {
  it("sets the date", () => {
    createAndLoginNewUser({
      type: "issuer",
      kyc: "business",
      seed: ISSUER_SETUP,
    }).then(() => {
      const newStartDate = moment()
        .startOf("day")
        .add(20, "days");

      // Happy path
      cy.visit(appRoutes.dashboard)
        .get(tid("eto-settings-start-date-input"))
        .clear()
        .type(newStartDate.format("MM/DD/YYYY"))
        .get(tid("eto-settings-start-date-confirm"))
        .click()
        .get(tid("set-eto-date-summary-time-to-eto"))
        .should("contain", "20")
        .get(tid("set-eto-date-summary-confirm-button"))
        .click();

      confirmAccessModal();

      cy.get(tid("modals.tx-sender.withdraw-flow.success"));

      closeModal();

      cy.get(tid("eto-settings-start-date-input"))
        .should($e =>
          expect(moment($e.val()).format("MM/DD/YYYY")).to.be.equal(
            newStartDate.format("MM/DD/YYYY"),
          ),
        )
        .get(tid("eto-settings-start-date-confirm"))
        .should("be.disabled");

      // should not be allowed to set a date that is too soon
      const falseDate = newStartDate.clone().subtract(17, "days");

      cy.get(tid("eto-settings-start-date-input"))

        .wait(5000) // wait until eto data has been reloaded
        .clear()
        .wait(500)
        .type(falseDate.format("MM/DD/YYYY"))
        .get(tid("eto-settings-start-date-confirm"))
        .should("be.disabled")
        .get(tid("form.etoStartDate.error-message"));
    });
  });
});
