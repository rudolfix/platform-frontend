import { tid } from "../../../test/testUtils";
import { appRoutes } from "../../components/appRoutes";
import { withParams } from "../../utils/withParams";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertEtoView } from "./EtoViewUtils";

const ETO_PPREVIEW_CODE = "4c701f6c-fa03-468c-9ffe-dd9b24f3ab84";

describe("Eto Investor View", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("should show investment notification when kyc is not done", () => {
    cy.visit(withParams(appRoutes.etoPublicView, { previewCode: ETO_PPREVIEW_CODE }));
    assertEtoView();

    cy.get(tid("eto-overview-settings-update-required-to-invest")).should("exist");
  });
});
