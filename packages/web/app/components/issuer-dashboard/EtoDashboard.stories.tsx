import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../test/fixtures";
import { mockedStore } from "../../../test/fixtures/mockedStore";
import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { withStore } from "../../utils/storeDecorator.unsafe";
import { EtoDashboardLayout } from "./EtoDashboard";
import { EEtoStep } from "./utils";

// KYC is not filled
const stateStepOne = {
  backupCodesVerified: true,
  shouldViewEtoSettings: false,
  shouldViewMarketingSubmissionSection: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: false,
  isOfferingDocumentSubmitted: false,
  eto: { ...testEto, state: EEtoState.PREVIEW },
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: false,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: false,
  shouldViewSubmissionSection: false,
  etoStep: EEtoStep.VERIFICATION,
};

// Fill in information about your company
const stateStepTwo = {
  ...stateStepOne,
  isVerificationSectionDone: true,
  userHasKycAndEmailVerified: true,
  etoStep: EEtoStep.FILL_INFORMATION_ABOUT_COMPANY,
};

// Publish your listing page
const stateStepThree = {
  ...stateStepTwo,
  shouldViewEtoSettings: true,
  shouldViewMarketingSubmissionSection: true,
  etoStep: EEtoStep.PUBLISH_LISTING_PAGE,
};

// Publish your listing page
const stateStepThreeFilled = {
  ...stateStepThree,
  shouldViewSubmissionSection: true,
  shouldViewMarketingSubmissionSection: true,
};

// Listing page in review
const stateStepFour = {
  ...stateStepThree,
  shouldViewMarketingSubmissionSection: false,
  etoStep: EEtoStep.LISTING_PAGE_IN_REVIEW,
};

const stateStepFourFilled = {
  ...stateStepThreeFilled,
  shouldViewMarketingSubmissionSection: false,
  etoStep: EEtoStep.LISTING_PAGE_IN_REVIEW,
};

// Set up your ETO
const stateStepFive = {
  ...stateStepFour,
  etoStep: EEtoStep.UPLOAD_SIGNED_TERMSHEET,
};

const stateStepFiveFilled = {
  ...stateStepFourFilled,
  etoStep: EEtoStep.UPLOAD_SIGNED_TERMSHEET,
};

const stateStepSix = {
  ...stateStepFiveFilled,
  isTermSheetSubmitted: true,
  etoStep: EEtoStep.PUBLISH_INVESTMENT_OFFER,
};

const stateStepSeven = {
  ...stateStepSix,
  eto: { ...stateStepSix.eto, state: EEtoState.PENDING },
  etoStep: EEtoStep.SEVEN,
};

const stateStepEight = {
  ...stateStepSix,
  eto: { ...stateStepSix.eto, state: EEtoState.LISTED },
  etoStep: EEtoStep.EIGHT,
};

const stateStepEightMemorandum = {
  ...stateStepSix,
  eto: { ...stateStepSix.eto, state: EEtoState.LISTED },
  offeringDocumentType: EOfferingDocumentType.MEMORANDUM,
  etoStep: EEtoStep.EIGHT,
};

const stateStepEightOnChain = {
  ...stateStepEight,
  eto: { ...stateStepEight.eto, state: EEtoState.ON_CHAIN },
};

storiesOf("ETO-Flow/Dashboard/StateView", module)
  .addDecorator(withStore(mockedStore))
  .add("Step 1 - Verification", () => <EtoDashboardLayout {...stateStepOne} />)
  .add("Step 2 - Company info", () => <EtoDashboardLayout {...stateStepTwo} />)
  .add("Step 3 - Publish listing (ETO not filled)", () => (
    <EtoDashboardLayout {...stateStepThree} />
  ))
  .add("Step 3 - Publish listing (ETO filled)", () => (
    <EtoDashboardLayout {...stateStepThreeFilled} />
  ))
  .add("Step 4 - Publish pending (ETO not filled)", () => <EtoDashboardLayout {...stateStepFour} />)
  .add("Step 4 - Publish pending (ETO filled)", () => (
    <EtoDashboardLayout {...stateStepFourFilled} />
  ))
  .add("Step 5 - Set up ETO (ETO not filled)", () => <EtoDashboardLayout {...stateStepFive} />)
  .add("Step 5 - Set up ETO (ETO filled)", () => <EtoDashboardLayout {...stateStepFiveFilled} />)
  .add("Step 6 - Publish your investment offer", () => <EtoDashboardLayout {...stateStepSix} />)
  .add("Step 7 - Investment offer in review", () => <EtoDashboardLayout {...stateStepSeven} />)
  .add("Step 8 - Campaign is live", () => <EtoDashboardLayout {...stateStepEight} />)
  .add("Step 8 - Campaign is live (Memorandum)", () => (
    <EtoDashboardLayout {...stateStepEightMemorandum} />
  ))
  .add("Step 8 - Campaign is live (On chain)", () => (
    <EtoDashboardLayout {...stateStepEightOnChain} />
  ));
