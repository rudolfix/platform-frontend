import { etoRegisterRoutes } from "../../components/eto/registration/routes";
import { assertEtoDashboard } from "../utils/assertions";
import { fillForm } from "../utils/forms";
import { goToEtoPreview } from "../utils/navigation";
import { formRichTextField, tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { aboutFormRequired, aboutFormSubmit } from "./fixtures";

describe("Eto Company Information Rich Text Editor", () => {
  it("should render field as rich-text", () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" });

    cy.visit(etoRegisterRoutes.companyInformation);
    cy.get(tid("eto.form.company-information")).should("exist");

    fillForm(
      {
        ...aboutFormRequired,
      },
      { submit: false },
    );

    cy.get(formRichTextField("companyDescription")).clear();

    cy.get(".ck.ck-toolbar > :nth-child(3)").click();
    cy.get(formRichTextField("companyDescription")).type("This is a bold text{enter}");

    fillForm(aboutFormSubmit);

    assertEtoDashboard();

    goToEtoPreview();

    cy.get(tid("eto-view-company-description"))
      .get("strong")
      .contains("This is a bold text");
  });
});
