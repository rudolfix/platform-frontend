import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EKycRequestStatus, EKycRequestType } from "../../../lib/api/kyc/KycApi.interfaces";
import { AccountSetupBackupSeedComponent } from "../../settings/backup-seed/AccountSetupBackupSeedComponent";
import { SetEmailComponent } from "../../settings/verify-email/AccountSetupVerifyEmailComponent";
import { AccountSetupKycComponent } from "./AccountSetupKycComponent";
import { OnboardingLayout, OnboardingMain } from "./Onboarding";
import { OnboardingKycPending } from "./OnboardingKycPending";
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
  .add("kyc pending - individual", () => (
    <OnboardingKycPending
      kycRequestStatus={EKycRequestStatus.PENDING}
      kycRequestType={EKycRequestType.INDIVIDUAL}
    />
  ))
  .add("kyc pending - business", () => (
    <OnboardingKycPending
      kycRequestStatus={EKycRequestStatus.PENDING}
      kycRequestType={EKycRequestType.BUSINESS}
    />
  ))
  .add("kyc rejected/ignored - individual", () => (
    <OnboardingKycPending
      kycRequestStatus={EKycRequestStatus.REJECTED}
      kycRequestType={EKycRequestType.INDIVIDUAL}
    />
  ))
  .add("kyc rejected/ignored - business", () => (
    <OnboardingKycPending
      kycRequestStatus={EKycRequestStatus.REJECTED}
      kycRequestType={EKycRequestType.BUSINESS}
    />
  ));
