import { registerWithLightWalletETO } from "../../../../e2e-test-utils";
import { assertErrorModal } from "../../../../e2e-test-utils/index";
import { assertEtoDashboard } from "./../../../../e2e-test-utils/index";

describe("Wallet backup e2e recovery phrase", () => {
  it("should register user with light-wallet", () => {
    registerWithLightWalletETO("moe-wallet-backup-e2e@test.com", "strongpassword");

    assertEtoDashboard();
  });

  it("should raise an error that user is already used", () => {
    registerWithLightWalletETO("0xE6Ad2@neufund.org", "strongpassword");

    assertErrorModal();
  });
});
