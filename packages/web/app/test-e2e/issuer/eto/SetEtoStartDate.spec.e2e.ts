import * as moment from "moment";

import { utcTime, weekdayUTC } from "../../../components/shared/utils";
import { closeModal, confirmAccessModal } from "../../utils/index";
import { goToIssuerDashboard } from "../../utils/navigation";
import { tid } from "../../utils/selectors";
import { loginFixtureAccount } from "../../utils/userHelpers";

const setStartDay = (startDate: moment.Moment, textToCheck: RegExp) => {
  goToIssuerDashboard();

  cy.get(tid("eto-settings-start-date-open-date-picker")).click();

  cy.get(tid("eto-settings-start-date-input"))
    .clear({ force: true })
    .type(startDate.format("MM/DD/YYYY HH:mm"), { force: true });

  cy.get(tid("eto-settings-start-date-confirm")).click();

  cy.get(tid("set-eto-date-summary-time-to-eto")).contains(textToCheck);

  cy.get(tid("set-eto-date-summary-confirm-button")).click();

  confirmAccessModal();

  cy.get(tid("modals.shared.tx-success.modal")).should("exist");

  closeModal();

  cy.get(tid("time-left.start-date-utc")).contains(
    `${weekdayUTC(startDate.toDate())}, ${utcTime(startDate.toDate())}`,
  );

  cy.get(tid("eto-settings-start-date-open-date-picker")).should("be.enabled");
};

describe("Eto start date setup", function(): void {
  it.skip("should setup an eto start date #eto #p3 #flaky", () => {
    // enable after
    loginFixtureAccount("ISSUER_SETUP");

    // happy path
    const newStartDate = moment
      .utc()
      .add(20, "days")
      .add(5, "hours")
      .add(5, "minute");

    // match non breaking spaces
    const newStartDateText = new RegExp(
      /^(19|20) days[\s|\u00A0]\d\d? hour(s?)[\s|\u00A0]\d\d? minute(s?)/,
    );

    setStartDay(newStartDate, newStartDateText);

    // should allow to set date to tomorrow
    const tomorrowStartDate = moment
      .utc()
      .add(24, "hours")
      .add(5, "minutes");

    const tomorrowStartDateText = new RegExp(/^(1) day/);

    setStartDay(tomorrowStartDate, tomorrowStartDateText);

    // should not be allowed to set a date that is too soon
    const falseDate = newStartDate.clone().subtract(20, "days");

    cy.get(tid("eto-settings-start-date-open-date-picker")).click();

    cy.get(tid("eto-settings-start-date-input"))
      .clear({ force: true })
      .type(falseDate.format("MM/DD/YYYY HH:mm"), { force: true });

    cy.get(tid("eto-settings-start-date-confirm")).should("be.disabled");

    cy.get(tid("form.etoStartDate.error-message")).should("exist");
  });
});
