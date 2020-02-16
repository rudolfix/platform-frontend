import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { AccountSetupBackupSeedComponent } from "../../settings/backup-seed/AccountSetupBackupSeedComponent";
import { AccountSetupKycComponent } from "../../settings/kyc-states/AccountSetupKycComponent";
import { SetEmailComponent } from "../../settings/verify-email/AccountSetupVerifyEmailComponent";
import { TOnboardingStepData } from "./types";

const setOrVerifyEmailStepData = (emailVerified: boolean) => ({
  key: "verifyEmail",
  conditionCompleted: emailVerified,
  title: <FormattedMessage id="account-setup.verify-email" />,
  component: <SetEmailComponent />,
});

const backupCodesStepData = (backupCodesVerified: boolean) => ({
  key: "verifyBackupCodes",
  conditionCompleted: backupCodesVerified,
  title: <FormattedMessage id="account-setup.verify-backup-codes" />,
  component: <AccountSetupBackupSeedComponent />,
});

const completeKycStepData = (kycCompleted: boolean) => ({
  key: "startKyc",
  conditionCompleted: kycCompleted,
  title: <FormattedMessage id="account-setup.verify-your-account" />,
  component: <AccountSetupKycComponent />,
});

export const lightWalletOnboardingSteps = (
  emailVerified: boolean,
  backupCodesVerified: boolean,
  kycCompleted: boolean,
): TOnboardingStepData[] => [
  setOrVerifyEmailStepData(emailVerified),
  backupCodesStepData(backupCodesVerified),
  completeKycStepData(kycCompleted),
];

export const onboardingSteps = (
  emailVerified: boolean,
  kycCompleted: boolean,
): TOnboardingStepData[] => [
  setOrVerifyEmailStepData(emailVerified),
  completeKycStepData(kycCompleted),
];
