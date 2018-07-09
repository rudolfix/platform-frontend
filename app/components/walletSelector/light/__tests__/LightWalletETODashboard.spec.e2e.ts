import {
  assertEtoDashboard,
  convertToUniqueEmail,
  registerWithLightWalletETO,
} from "../../../../e2e-test-utils";
import {
  assertBackupSeedWidgetVisible,
  assertEmailActivationWidgetVisible,
  goToDashboard,
} from "../../../../e2e-test-utils/index";

import { backupLightWalletSeed } from "../../../settings/backupSeed/__tests__/BackupSeed.spec.e2e";
import { verifyLatestUserEmail } from "./../../../../e2e-test-utils/index";

const password = "strongpassword";

describe("Light Wallet ETO Dashboard", () => {
  it.only("should register verify an email and assert that the dashboard is changing", () => {
    const testEmail = convertToUniqueEmail("moe@test.com");

    registerWithLightWalletETO(testEmail, password);

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
