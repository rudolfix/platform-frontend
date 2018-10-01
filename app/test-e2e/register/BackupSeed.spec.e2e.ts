import { registerWithLightWallet } from "../utils";
import { backupLightWalletSeed } from "../shared/backupLightWalletSeed";

describe("Wallet backup recovery phrase", () => {
  it("should recover wallet from saved phrases", () => {
    registerWithLightWallet("moe-recover-wallet@test.com", "strongpassword");

    backupLightWalletSeed();
  });
});
