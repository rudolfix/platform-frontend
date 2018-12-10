import * as moment from "moment";

import { appRoutes } from "../../components/appRoutes";
import { ISSUER_SETUP, ISSUER_SETUP_NO_ST } from "../constants";
import { tid } from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Eto start date setup", () => {
  it("sets the date", () => {
    createAndLoginNewUser({
      type: "issuer",
      kyc: "business",
      seed: ISSUER_SETUP,
    }).then(() => {
      cy.visit(appRoutes.dashboard);
      const newStartDate = moment().add(20, "days");

      cy.get(tid("eto-settings-start-date-input"))
        .clear()
        .type(newStartDate.format("MM/DD/YYYY"))
        .get(tid("eto-settings-start-date-confirm"))
        .click();
    });
  });
});
