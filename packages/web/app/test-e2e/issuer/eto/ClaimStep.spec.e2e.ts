import { goToIssuerDashboard, loginFixtureAccount } from "../../utils";
import { assertClaimStep } from "./EtoRegistrationUtils";

describe("Eto claim step", () => {
  it("should show withdraw fund and tokenholders sections", () => {
    loginFixtureAccount("ISSUER_CLAIMS");

    goToIssuerDashboard();

    assertClaimStep();
  });
});
