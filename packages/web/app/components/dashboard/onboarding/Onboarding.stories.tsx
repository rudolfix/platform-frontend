import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EKycRequestStatus } from "../../../lib/api/kyc/KycApi.interfaces";
import { AccountSetupBackupSeedComponent } from "../../settings/backup-seed/AccountSetupBackupSeedComponent";
import { AccountSetupKycComponent } from "../../settings/kyc-states/AccountSetupKycComponent";
import { SetEmailComponent } from "../../settings/verify-email/AccountSetupVerifyEmailComponent";
import { OnboardingLayout, OnboardingMain } from "./Onboarding";
import { OnboardingKycPendingBase } from "./OnboardingKycPending";
import { EOnboardingStepState } from "./types";

const steps = [
  {
    key: "verifyEmail",
    title: <FormattedMessage id="account-setup.verify-email" />,
    number: 1,
    component: <SetEmailComponent />,
    isLast: false,
    stepState: EOnboardingStepState.DONE,
  },
  {
    key: "verifyBackupCodes",
    title: <FormattedMessage id="account-setup.verify-backup-codes" />,
    number: 2,
    component: <AccountSetupBackupSeedComponent />,
    isLast: false,
    stepState: EOnboardingStepState.ACTIVE,
  },
  {
    key: "startKyc",
    title: <FormattedMessage id="account-setup.verify-your-account" />,
    number: 2,
    component: <AccountSetupKycComponent />,
    isLast: true,
    stepState: EOnboardingStepState.NOT_DONE,
  },
];

storiesOf("Onboarding", module)
  .add("onboarding steps", () => (
    <OnboardingLayout>
      <OnboardingMain accountSetupStepsData={steps} />
    </OnboardingLayout>
  ))
  .add("kyc pending", () => (
    <OnboardingKycPendingBase kycRequestStatus={EKycRequestStatus.PENDING} />
  ));
