import { createAndLoginNewUser } from "../utils/userHelpers";
import { goToIssuerEtoView } from "./EtoViewUtils";

describe("Eto Issuer View", () => {
  it("should load empty Eto", function(): void {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(() => {
      goToIssuerEtoView();
    });
  });
});
