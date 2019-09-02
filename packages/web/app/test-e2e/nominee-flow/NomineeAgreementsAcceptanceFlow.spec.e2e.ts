import { goToNomineeDashboard, loginFixtureAccount } from "../utils/index";
import { assertNoTasks, signRAAA, signTHA } from "./NomineeFlowUtils";

describe("Nominee agreements acceptance flow", () => {
  it("should accept agreements", () => {
    loginFixtureAccount("NOMINEE_SETUP_NO_ST", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      goToNomineeDashboard();

      signTHA();
      signRAAA();

      assertNoTasks();
    });
  });
});
