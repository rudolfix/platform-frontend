import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import {
  selectBackupCodesVerified,
  selectIsUserEmailVerified,
  selectVerifiedUserEmail,
} from "../../modules/auth/selectors";
import {
  selectIsPamphletSubmitted,
  selectIsProspectusSubmitted,
  selectIsTermSheetSubmitted,
} from "../../modules/eto-documents/selectors";
import {
  calculateGeneralEtoData,
  selectCombinedEtoCompanyData,
  selectEtoState,
  selectShouldEtoDataLoad,
} from "../../modules/eto-flow/selectors";
import { selectKycRequestStatus } from "../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SettingsWidgets } from "../settings/SettingsWidgets";
import { EtoProjectState } from "../shared/EtoProjectState";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { BookBuildingWidget } from "./dashboard/bookBuildingWidget/BookBuildingWidget";
import { ChoosePreEtoDateWidget } from "./dashboard/choosePreEtoDateWidget/ChoosePreEtoDateWidget";
import { ETOFormsProgressSection } from "./dashboard/ETOFormsProgressSection";
import { SubmitProposalWidget } from "./dashboard/submitProposalWidget/SubmitProposalWidget";
import { UploadPamphletWidget } from "./dashboard/UploadPamphletWidget";
import { UploadProspectusWidget } from "./dashboard/UploadProspectusWidget";
import { UploadTermSheetWidget } from "./dashboard/UploadTermSheetWidget";
import { DashboardSection } from "./shared/DashboardSection";

const SUBMIT_PROPOSAL_THRESHOLD = 0.5;
// TODO: CHANGE TO 100% when data model in interfaces represents swagger

interface IStateProps {
  isLightWallet: boolean;
  verifiedEmail?: string;
  backupCodesVerified?: boolean;
  shouldEtoDataLoad?: boolean;
  requestStatus?: TRequestStatus;
  etoState?: EtoState;
  etoFormProgress?: number;
  isTermSheetSubmitted?: boolean;
  isPamphletSubmitted?: boolean;
  isProspectusSubmitted?: boolean;
}

interface IDispatchProps {
  loadFileDataStart: () => void;
}

type IProps = IStateProps & IDispatchProps;

const SubmitDashBoardSection: React.SFC<{ isTermSheetSubmitted?: boolean }> = ({
  isTermSheetSubmitted,
}) => (
  <>
    <DashboardSection
      step={3}
      title="UPLOAD FILES / SUBMIT PROPOSAL"
      data-test-id="eto-dashboard-verification"
    />
    {isTermSheetSubmitted ? (
      <Col lg={4} xs={12}>
        <SubmitProposalWidget />
      </Col>
    ) : (
      <Col lg={4} xs={12}>
        <UploadTermSheetWidget />
      </Col>
    )}
  </>
);

const EtoProgressDashboardSection: React.SFC = () => (
  <>
    <DashboardSection step={2} title="ETO APPLICATION" />
    <Col xs={12}>
      <FormattedMessage id="eto-dashboard-application-description" />
    </Col>
    <ETOFormsProgressSection />
  </>
);

interface IEtoStateRender {
  etoState?: EtoState;
  shouldViewSubmissionSection?: boolean;
  isTermSheetSubmitted?: boolean;
  isPamphletSubmitted?: boolean;
  isProspectusSubmitted?: boolean;
}

const EtoStateViewRender: React.SFC<IEtoStateRender> = ({
  etoState,
  shouldViewSubmissionSection,
  isTermSheetSubmitted,
  isPamphletSubmitted,
  isProspectusSubmitted,
}) => {
  switch (etoState) {
    case "preview":
      return (
        <>
          {shouldViewSubmissionSection && (
            <SubmitDashBoardSection isTermSheetSubmitted={isTermSheetSubmitted} />
          )}
          <EtoProgressDashboardSection />
        </>
      );
    case "pending":
      return (
        <>
          <DashboardSection hasDecorator={false} title={<EtoProjectState status={etoState} />} />
          <ETOFormsProgressSection />
        </>
      );
    case "listed":
      return (
        <>
          <DashboardSection hasDecorator={false} title={<EtoProjectState status={etoState} />} />
          <Col lg={4} xs={12}>
            <BookBuildingWidget />
          </Col>
          {!isPamphletSubmitted && (
            <Col lg={4} xs={12}>
              <UploadProspectusWidget />
            </Col>
          )}
          {!isProspectusSubmitted && (
            <Col lg={4} xs={12}>
              <UploadPamphletWidget />
            </Col>
          )}
          <Col xs={12}>
            <FormattedMessage id="eto-dashboard-application-description" />
          </Col>
          <ETOFormsProgressSection />
        </>
      );
    case "prospectus_approved":
      return (
        <>
          <DashboardSection hasDecorator={false} title={<EtoProjectState status={etoState} />} />
          <Col lg={4} xs={12}>
            <BookBuildingWidget />
          </Col>
          {!isPamphletSubmitted && (
            <Col lg={4} xs={12}>
              <UploadProspectusWidget />
            </Col>
          )}
          {!isProspectusSubmitted && (
            <Col lg={4} xs={12}>
              <UploadPamphletWidget />
            </Col>
          )}
          <Col lg={4} xs={12}>
            <ChoosePreEtoDateWidget />
          </Col>
          <Col xs={12}>
            <FormattedMessage id="eto-dashboard-application-description" />
          </Col>
          <ETOFormsProgressSection />
        </>
      );
    default:
      return <LoadingIndicator />;
  }
};

class EtoDashboardComponent extends React.Component<IProps> {
  componentDidMount(): void {
    const { shouldEtoDataLoad, loadFileDataStart } = this.props;

    if (shouldEtoDataLoad) loadFileDataStart();
  }

  render(): React.ReactNode {
    const {
      verifiedEmail,
      backupCodesVerified,
      requestStatus,
      etoState,
      isLightWallet,
      etoFormProgress,
      isTermSheetSubmitted,
      shouldEtoDataLoad,
      isPamphletSubmitted,
      isProspectusSubmitted,
    } = this.props;

    const isVerificationSectionDone = !!(
      verifiedEmail &&
      (backupCodesVerified || !isLightWallet) &&
      requestStatus === "Accepted"
    );
    const shouldViewSubmissionSection = !!(
      etoFormProgress && etoFormProgress >= SUBMIT_PROPOSAL_THRESHOLD
    );

    return (
      <LayoutAuthorized>
        <Row className="row-gutter-top" data-test-id="eto-dashboard-application">
          {!isVerificationSectionDone && (
            <>
              <DashboardSection
                step={1}
                title="VERIFICATION"
                data-test-id="eto-dashboard-verification"
              />
              <SettingsWidgets isDynamic={true} {...this.props} />
            </>
          )}

          {shouldEtoDataLoad ? (
            <EtoStateViewRender
              {...{
                isTermSheetSubmitted,
                isPamphletSubmitted,
                isProspectusSubmitted,
                shouldViewSubmissionSection,
                etoState,
              }}
            />
          ) : (
            <EtoProgressDashboardSection />
          )}
        </Row>
      </LayoutAuthorized>
    );
  }
}

export const EtoDashboard = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      kycStatus: selectKycRequestStatus(s.kyc),
      isEmailVerified: selectIsUserEmailVerified(s.auth),
      isLightWallet: selectIsLightWallet(s.web3),
      verifiedEmail: selectVerifiedUserEmail(s.auth),
      backupCodesVerified: selectBackupCodesVerified(s.auth),
      shouldEtoDataLoad: selectShouldEtoDataLoad(s),
      requestStatus: selectKycRequestStatus(s.kyc),
      etoState: selectEtoState(s.etoFlow),
      isTermSheetSubmitted: selectIsTermSheetSubmitted(s.etoDocuments),
      isPamphletSubmitted: selectIsPamphletSubmitted(s.etoDocuments),
      isProspectusSubmitted: selectIsProspectusSubmitted(s.etoDocuments),
      etoFormProgress: calculateGeneralEtoData(selectCombinedEtoCompanyData(s.etoFlow)),
    }),
    dispatchToProps: dispatch => ({
      loadFileDataStart: () => dispatch(actions.etoDocuments.loadFileDataStart()),
    }),
  }),
)(EtoDashboardComponent);
