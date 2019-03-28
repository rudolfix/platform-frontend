import { backupLightWalletSeed } from "../shared/backupLightWalletSeed";
import {
  assertBackupSeedWidgetVisible,
  assertEmailActivationWidgetVisible,
  assertEtoDashboard,
  registerWithLightWalletETO,
  verifyLatestUserEmail,
} from "../utils";
import { goToEtoDashboard } from "../utils/navigation";
import { DEFAULT_PASSWORD, generateRandomEmailAddress } from "../utils/userHelpers";

describe("Light Wallet ETO Dashboard", () => {
  it("should register verify an email and assert that the dashboard is changing", () => {
    registerWithLightWalletETO(generateRandomEmailAddress(), DEFAULT_PASSWORD);

    assertEtoDashboard();
    assertBackupSeedWidgetVisible();
    assertEmailActivationWidgetVisible();

    backupLightWalletSeed();
    goToEtoDashboard();

    assertBackupSeedWidgetVisible(true);
    assertEmailActivationWidgetVisible();

    verifyLatestUserEmail();
    goToEtoDashboard();

    assertEmailActivationWidgetVisible(true);
    assertBackupSeedWidgetVisible(true);
  });
});
