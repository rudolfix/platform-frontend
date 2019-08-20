import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../test/fixtures";
import { mockedStore } from "../../../test/fixtures/mockedStore";
import {
  EEtoMarketingDataVisibleInPreview,
  EEtoState,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { withStore } from "../../utils/storeDecorator.unsafe";
import { EtoDashboardComponent } from "./EtoDashboard";
import { EEtoStep } from "./utils";

// KYC is not filled
const stateStepOne = {
  shouldViewEtoSettings: false,
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
  etoStep: EEtoStep.ONE,
};

// Fill in information about your company
const stateStepTwo = {
  ...stateStepOne,
  isVerificationSectionDone: true,
  userHasKycAndEmailVerified: true,
  etoStep: EEtoStep.TWO,
};

// Publish your listing page
const stateStepThree = {
  ...stateStepTwo,
  shouldViewEtoSettings: true,
  etoStep: EEtoStep.THREE,
};

// Publish your listing page
const stateStepThreeFilled = {
  ...stateStepThree,
  shouldViewSubmissionSection: true,
};

// Listing page in review
const stateStepFour = {
  ...stateStepThree,
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview.VISIBILITY_PENDING,
  etoStep: EEtoStep.FOUR,
};

const stateStepFourFilled = {
  ...stateStepThreeFilled,
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview.VISIBILITY_PENDING,
  etoStep: EEtoStep.FOUR,
};

// Set up your ETO
const stateStepFive = {
  ...stateStepFour,
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview.VISIBLE,
  etoStep: EEtoStep.FIVE,
};

const stateStepFiveFilled = {
  ...stateStepFourFilled,
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview.VISIBLE,
  etoStep: EEtoStep.FIVE,
};

const stateStepSix = {
  ...stateStepFiveFilled,
  isTermSheetSubmitted: true,
  etoStep: EEtoStep.SIX,
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
  .add("Step 1 - Verification", () => <EtoDashboardComponent {...stateStepOne} />)
  .add("Step 2 - Company info", () => <EtoDashboardComponent {...stateStepTwo} />)
  .add("Step 3 - Publish listing (ETO not filled)", () => (
    <EtoDashboardComponent {...stateStepThree} />
  ))
  .add("Step 3 - Publish listing (ETO filled)", () => (
    <EtoDashboardComponent {...stateStepThreeFilled} />
  ))
  .add("Step 4 - Publish pending (ETO not filled)", () => (
    <EtoDashboardComponent {...stateStepFour} />
  ))
  .add("Step 4 - Publish pending (ETO filled)", () => (
    <EtoDashboardComponent {...stateStepFourFilled} />
  ))
  .add("Step 5 - Set up ETO (ETO not filled)", () => <EtoDashboardComponent {...stateStepFive} />)
  .add("Step 5 - Set up ETO (ETO filled)", () => <EtoDashboardComponent {...stateStepFiveFilled} />)
  .add("Step 6 - Publish your investment offer", () => <EtoDashboardComponent {...stateStepSix} />)
  .add("Step 7 - Investment offer in review", () => <EtoDashboardComponent {...stateStepSeven} />)
  .add("Step 8 - Campaign is live", () => <EtoDashboardComponent {...stateStepEight} />)
  .add("Step 8 - Campaign is live (Memorandum)", () => (
    <EtoDashboardComponent {...stateStepEightMemorandum} />
  ))
  .add("Step 8 - Campaign is live (On chain)", () => (
    <EtoDashboardComponent {...stateStepEightOnChain} />
  ));
