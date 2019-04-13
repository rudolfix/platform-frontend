import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Row } from "reactstrap";

import { testEto } from "../../../test/fixtures";
import { mockedStore } from "../../../test/fixtures/mockedStore";
import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EETOStateOnChain } from "../../modules/public-etos/types";
import { withStore } from "../../utils/storeDecorator.unsafe";
import { EtoDashboardStateViewComponent } from "./EtoDashboard";

const statePreview = {
  etoState: EEtoState.PREVIEW,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  stateOnChain: null,
};

const statePreviewNoSubmissionSection = {
  etoState: EEtoState.PREVIEW,
  shouldViewSubmissionSection: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  stateOnChain: null,
};

const statePending = {
  etoState: EEtoState.PENDING,
  shouldViewSubmissionSection: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  stateOnChain: null,
};

const stateListed_1 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  stateOnChain: null,
};

const stateListed_2 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: false,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  stateOnChain: null,
};

const stateListed_3 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: false,
  previewCode: testEto.previewCode,
  isRetailEto: false,
  stateOnChain: null,
};

const stateProspectusApproved_1 = {
  etoState: EEtoState.PROSPECTUS_APPROVED,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  stateOnChain: null,
};

const stateProspectusApproved_2 = {
  etoState: EEtoState.PROSPECTUS_APPROVED,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  stateOnChain: null,
};

const stateOnChainWhitelist = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  stateOnChain: EETOStateOnChain.Whitelist,
};

const stateOnChainSigning = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  stateOnChain: EETOStateOnChain.Signing,
};

const stateOnChainRefund = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  stateOnChain: EETOStateOnChain.Refund,
};

const stateOnChainClaim = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  stateOnChain: EETOStateOnChain.Claim,
};

storiesOf("ETO-Flow/Dashboard/StateView", module)
  .addDecorator(withStore(mockedStore))
  .add("State PREVIEW with submissionSection", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...statePreview} />
    </Row>
  ))
  .add("State PREVIEW, no submissionSection", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...statePreviewNoSubmissionSection} />
    </Row>
  ))
  .add("State PENDING", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...statePending} />
    </Row>
  ))
  .add("State LISTED, retail eto, canEnableBookbuilding, eto submitted ", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateListed_1} />
    </Row>
  ))
  .add("State LISTED, retail eto, eto not submitted", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateListed_2} />
    </Row>
  ))
  .add("State LISTED, canEnableBookbuilding, eto not submitted", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateListed_3} />
    </Row>
  ))
  .add("State PROSPECTUS_APPROVED", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateProspectusApproved_1} />
    </Row>
  ))
  .add("State PROSPECTUS_APPROVED, canEnableBookbuilding", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateProspectusApproved_2} />
    </Row>
  ))
  .add("State OnChain whitelist", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateOnChainWhitelist} />
    </Row>
  ))
  .add("State OnChain Signing", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateOnChainSigning} />
    </Row>
  ))
  .add("State OnChain claim", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateOnChainClaim} />
    </Row>
  ))
  .add("State OnChain refund", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateOnChainRefund} />
    </Row>
  ));
