import {
  assertBackupSeedWidgetVisible,
  assertEmailActivationWidgetVisible,
  assertEtoDashboard,
  convertToUniqueEmail,
  goToDashboard,
  registerWithLightWalletETO,
  verifyLatestUserEmail,
} from "../utils";
import { backupLightWalletSeed } from "../shared/backupLightWalletSeed";
import { DEFAULT_PASSWORD, generateRandomEmailAddress } from "../utils/userHelpers";

describe("Light Wallet ETO Dashboard", () => {
  it("should register verify an email and assert that the dashboard is changing", () => {
    registerWithLightWalletETO(generateRandomEmailAddress(), DEFAULT_PASSWORD);

    assertEtoDashboard();
    assertBackupSeedWidgetVisible();
    assertEmailActivationWidgetVisible();

    backupLightWalletSeed();
    goToDashboard();

    assertEtoDashboard();
    assertBackupSeedWidgetVisible(true);
    assertEmailActivationWidgetVisible();

    verifyLatestUserEmail();
    goToDashboard();

    assertEtoDashboard();
    assertEmailActivationWidgetVisible(true);
    assertBackupSeedWidgetVisible(true);
  });
});
