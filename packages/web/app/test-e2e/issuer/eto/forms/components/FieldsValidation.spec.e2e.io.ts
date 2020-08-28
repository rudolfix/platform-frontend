import pick from "lodash/fp/pick";

import { fillForm, getFieldError } from "../../../../utils/forms";
import { formField, tid } from "../../../../utils/selectors";
import { createAndLoginNewUser } from "../../../../utils/userHelpers";
import { goToCompanyInformation } from "../../EtoRegistrationUtils";
import { aboutFormRequired, aboutFormSubmit } from "../../fixtures";

describe("Eto Company Information Field Validation", function(): void {
  before(() => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" });
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    goToCompanyInformation();
  });

  it("should focus first invalid input field #eto #p3", () => {
    fillForm({
      ...aboutFormSubmit,
    });

    cy.focused().should("have.attr", "name", "brandName");
  });

  it("should focus first invalid textarea field #eto #p3", () => {
    const requiredInputFields = pick(
      ["brandName", "companyWebsite", "companyOneliner", "companyDescription"],
      aboutFormRequired,
    );

    fillForm({
      ...requiredInputFields,
      ...aboutFormSubmit,
    });

    cy.focused().should("have.attr", "name", "keyQuoteFounder");
  });

  it("should focus first invalid rich text field #eto #p3", () => {
    const requiredInputFields = pick(
      ["brandName", "companyWebsite", "companyOneliner"],
      aboutFormRequired,
    );

    fillForm({
      ...requiredInputFields,
      ...aboutFormSubmit,
    });

    cy.focused().should("match", formField("companyDescription"));
  });

  it("should correctly validate required fields #eto #p3", () => {
    const requiredFields = Object.keys(aboutFormRequired);

    requiredFields.forEach(key => {
      getFieldError(tid("eto.form.company-information"), key).then(
        error => expect(error).to.be.empty,
      );
    });

    fillForm({
      ...aboutFormSubmit,
    });

    requiredFields.forEach(key => {
      getFieldError(tid("eto.form.company-information"), key).then(error =>
        expect(error).to.equal("This field is required"),
      );
    });
  });
});
