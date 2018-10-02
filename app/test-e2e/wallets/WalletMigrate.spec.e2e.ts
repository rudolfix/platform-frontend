import { createAndLoginNewUser } from "../utils/userHelpers";
import { tid, assertDashboard } from "../utils";
describe("Auto Login", () => {
  beforeEach(() =>
    createAndLoginNewUser({
      type: "investor",
      seed:
        "behind cool coyote edit have demise arena glare early embrace potato tray unit repair shine huge duty hybrid relax cage embrace cinnamon please hip",
    }));

  it("will auto login", () => {
    cy.visit("/settings");
    // just a basic check wether the dashboard is working
    // assertDashboard();
    cy.get(tid("models.settings.icbm-wallet-widget.check-your-icbm-wallet-widget.address")).type(
      "0x429123b08df32b0006fd1f3b0ef893a8993802f3{enter}",
    );
  });
});
