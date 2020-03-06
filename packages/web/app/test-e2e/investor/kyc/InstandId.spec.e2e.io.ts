import { fillForm } from "../../utils/forms";
import { tid } from "../../utils/selectors";
import { createAndLoginNewUser } from "../../utils/userHelpers";
import { kycFinancialDisclosureForm, kycInvidualAddressForm, kycInvidualForm } from "./fixtures";
import {
  assertIndividualAddress,
  assertIndividualDocumentVerification,
  goToPersonalVerification,
} from "./utils";

describe("Instant ID Provider", () => {
  it("should show only onfido as supported provider when individual nationality is Zimbabwe #kyc #p3", () => {
    createAndLoginNewUser({ type: "investor" });

    goToPersonalVerification();

    fillForm({
      ...kycInvidualForm,
      nationality: {
        value: "ZW",
        type: "select",
      },
    });

    assertIndividualAddress();
    fillForm(kycInvidualAddressForm);
    fillForm(kycFinancialDisclosureForm);
    assertIndividualDocumentVerification();

    cy.get(tid("kyc-go-to-outsourced-verification-onfido")).should("exist");

    cy.get(tid("kyc-go-to-outsourced-verification-id_now")).should("not.exist");
  });
});
