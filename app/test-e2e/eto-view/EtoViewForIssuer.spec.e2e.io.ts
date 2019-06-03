import { appRoutes } from "../../components/appRoutes";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertIssuerEtoView } from "./EtoViewUtils";

describe("Eto Issuer View", () => {
  it("should load empty Eto", function(): void {
    this.retries(2);
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      cy.visit(appRoutes.etoIssuerView);
      assertIssuerEtoView();
    });
  });
});
