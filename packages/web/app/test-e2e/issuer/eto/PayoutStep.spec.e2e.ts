import { goToIssuerDashboard, loginFixtureAccount } from "../../utils";
import { assertPayoutStep } from "./EtoRegistrationUtils";

describe("Eto payout step", () => {
  it("should show withdraw fund and tokenholders sections", () => {
    loginFixtureAccount("ISSUER_PAYOUT");

    goToIssuerDashboard();

    assertPayoutStep();
  });
});
