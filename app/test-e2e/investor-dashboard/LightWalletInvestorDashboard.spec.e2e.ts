import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertDashboard } from "../utils";
import { tid } from "../utils/selectors";

describe("Auto Login", () => {
  it("will auto login", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      cy.visit("/dashboard");
      // just a basic check wether the dashboard is working
      assertDashboard();
    });
  });
});
