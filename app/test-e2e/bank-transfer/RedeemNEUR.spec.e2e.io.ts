import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  formatNumber,
  selectDecimalPlaces,
} from "../../components/shared/formatters/utils";
import { fillForm } from "../utils/forms";
import { assertWallet, getWalletNEurAmount } from "../utils/index";
import { formField, tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";
import { assertBankAccountDetails } from "./assertions";

describe("Redeem NEUR", () => {
  beforeEach(() => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC", {
      kyc: "business",
    }).then(() => {
      // store actual balance
      getWalletNEurAmount().as("currentAmount");

      assertWallet();

      // check if bank account is linked
      assertBankAccountDetails();

      // start redeem flow
      cy.get(tid("wallet-balance.neur.redeem-button")).click();
    });
  });

  it("should not allow to use value below 5 NEUR", () => {
    fillForm(
      {
        amount: "2.22",
      },
      { submit: false },
    );
    cy.get(tid("form.amount.error-message")).should("exist");
    cy.get(tid("bank-transfer.reedem-init.continue")).should("be.disabled");
  });

  it("should not allow to use value above NEUR balance", () => {
    fillForm(
      {
        amount: "9999999999.99",
      },
      { submit: false },
    );
    cy.get(tid("form.amount.error-message")).should("exist");
    cy.get(tid("bank-transfer.reedem-init.continue")).should("be.disabled");
  });

  it("should correctly format input", () => {
    const value = "-3s32aa@fax2.24@#2535%s9sf92";

    fillForm(
      {
        amount: value,
      },
      { submit: false },
    );
    cy.get(tid("form.amount.error-message")).should("exist");
    cy.get(tid("bank-transfer.reedem-init.continue")).should("be.disabled");

    const nextValue = "123456789.99";

    fillForm(
      {
        amount: nextValue,
      },
      { submit: false },
    );

    const nextExpectedValue = formatNumber({
      value: nextValue,
      outputFormat: ENumberOutputFormat.FULL,
      inputFormat: ENumberInputFormat.FLOAT,
      decimalPlaces: selectDecimalPlaces(ECurrency.EUR),
    });

    cy.get(formField("amount")).should("have.value", nextExpectedValue);
  });
});
