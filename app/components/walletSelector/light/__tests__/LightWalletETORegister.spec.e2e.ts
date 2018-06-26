import { tid } from "../../../../../test/testUtils";
import { registerWithLightWalletETO } from "../../../../e2e-test-utils";

describe("Wallet backup e2e recovery phrase", () => {
  it("should register user with light-wallet", () => {
    registerWithLightWalletETO("moe-wallet-backup-e2e@test.com", "strongpassword");
  });
});
