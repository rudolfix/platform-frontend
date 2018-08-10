import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EtoState,
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import {
  selectBackupCodesVerified,
  selectIsUserEmailVerified,
  selectVerifiedUserEmail,
} from "../../modules/auth/selectors";
import {
  calculateCompanyInformationProgress,
  calculateEtoEquityTokenInfoProgress,
  calculateEtoKeyIndividualsProgress,
  calculateEtoMediaProgress,
  calculateEtoRiskAssessmentProgress,
  calculateEtoTermsProgress,
  calculateEtoVotingRightProgress,
  calculateGeneralEtoData,
  calculateInvestmentTermsProgress,
  calculateLegalInformationProgress,
  calculateProductVisionProgress,
  selectCombinedEtoCompanyData,
  selectCompanyData,
  selectEtoData,
  selectEtoLoadingData,
  selectEtoState,
  selectIsPamphletSubmitted,
  selectIsProspectusSubmitted,
  selectIsTermSheetSubmitted,
} from "../../modules/eto-flow/selectors";

import { selectKycRequestStatus } from "../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SettingsWidgets } from "../settings/SettingsWidgets";
import { EtoProjectState } from "../shared/EtoProjectStatus";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { BookBuildingWidget } from "./dashboard/bookBuildingWidget/BookBuildingWidget";
import { ChoosePreEtoDateWidget } from "./dashboard/choosePreEtoDateWidget/ChoosePreEtoDateWidget";
import {
  ETOFormsProgressSection,
  IEtoFormsProgressSectionProps,
} from "./dashboard/ETOFormsProgressSection";
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
  requestStatus?: TRequestStatus;
  isEmailVerified?: boolean;
  etoState?: EtoState;
  kycStatus?: TRequestStatus;
  etoFormProgress?: number;
  loadingData: boolean;
  companyData: TPartialCompanyEtoData;
  etoData: TPartialEtoSpecData;
  isTermSheetSubmitted?: boolean;
  isPamphletSubmitted?: boolean;
  isProspectusSubmitted?: boolean;
  companyInformationProgress: number;
  etoTermsProgress: number;
  etoKeyIndividualsProgress: number;
  legalInformationProgress: number;
  productVisionProgress: number;
  etoMediaProgress: number;
  etoRiskAssessmentProgress: number;
  etoEquityTokenInfoProgress: number;
  etoVotingRightProgress: number;
  etoInvestmentTermsProgress: number;
}

interface IDispatchProps {
  loadDataStart: () => void;
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

const EtoProgressDashboardSection: React.SFC<IEtoFormsProgressSectionProps> = props => (
  <>
    <DashboardSection step={2} title="ETO APPLICATION" />
    <ETOFormsProgressSection {...props} />
  </>
);

class EtoDashboardComponent extends React.Component<IProps> {
  componentDidMount(): void {
    const { kycStatus, isEmailVerified, loadDataStart, loadFileDataStart } = this.props;

    const shouldEtoDataLoad = kycStatus === "Accepted" && isEmailVerified;
    if (shouldEtoDataLoad) {
      loadDataStart();
      loadFileDataStart();
    }
  }

  render(): React.ReactNode {
    const {
      verifiedEmail,
      backupCodesVerified,
      requestStatus,
      kycStatus,
      isEmailVerified,
      etoState,
      isLightWallet,
      etoFormProgress,
      loadingData,
      isTermSheetSubmitted,
      isPamphletSubmitted,
      isProspectusSubmitted,
      companyInformationProgress,
      etoTermsProgress,
      etoKeyIndividualsProgress,
      legalInformationProgress,
      productVisionProgress,
      etoMediaProgress,
      etoRiskAssessmentProgress,
      etoEquityTokenInfoProgress,
      etoVotingRightProgress,
      etoInvestmentTermsProgress,
    } = this.props;

    const etoProgressProps = {
      loadingData,
      companyInformationProgress,
      etoTermsProgress,
      etoKeyIndividualsProgress,
      legalInformationProgress,
      productVisionProgress,
      etoMediaProgress,
      etoRiskAssessmentProgress,
      etoEquityTokenInfoProgress,
      etoVotingRightProgress,
      etoInvestmentTermsProgress,
    };

    const shouldEtoDataLoad = kycStatus === "Accepted" && isEmailVerified;
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
          {loadingData || (shouldEtoDataLoad && !etoState) ? (
            <LoadingIndicator />
          ) : (
            <>
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

              {(etoState === "preview" || !etoState) && (
                <>
                  {shouldViewSubmissionSection && (
                    <SubmitDashBoardSection isTermSheetSubmitted={isTermSheetSubmitted} />
                  )}
                  <EtoProgressDashboardSection
                    {...etoProgressProps}
                    shouldEtoDataLoad={shouldEtoDataLoad!}
                  />
                </>
              )}
              {(etoState === "pending" ||
                etoState === "listed" ||
                etoState === "prospectus_approved") && (
                <>
                  <DashboardSection
                    hasDecorator={false}
                    title={<EtoProjectState status={etoState} />}
                  />
                  {(etoState === "listed" || etoState === "prospectus_approved") && (
                    <>
                      <Col lg={4} xs={12}>
                        {/* TODO: Add visibility logic for BookBuildingWidget*/}
                        <BookBuildingWidget />
                      </Col>
                      {!isPamphletSubmitted && (
                        <Col lg={4} xs={12}>
                          {/* TODO: Add visibility logic for UploadProspectusWidget*/}
                          <UploadProspectusWidget />
                        </Col>
                      )}
                      {!isProspectusSubmitted && (
                        <Col lg={4} xs={12}>
                          <UploadPamphletWidget />
                        </Col>
                      )}
                    </>
                  )}
                  {etoState === "prospectus_approved" && (
                    <Col lg={4} xs={12}>
                      <ChoosePreEtoDateWidget />
                    </Col>
                  )}
                  <Col xs={12}>
                    <FormattedMessage id="eto-dashboard-application-description" />
                  </Col>
                  <ETOFormsProgressSection
                    {...etoProgressProps}
                    shouldEtoDataLoad={shouldEtoDataLoad!}
                  />
                </>
              )}
            </>
          )}
        </Row>
      </LayoutAuthorized>
    );
  }
}

export const EtoDashboard = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      companyData: selectCompanyData(s.etoFlow),
      etoData: selectEtoData(s.etoFlow),
      loadingData: selectEtoLoadingData(s.etoFlow),
      kycStatus: selectKycRequestStatus(s.kyc),
      isEmailVerified: selectIsUserEmailVerified(s.auth),
      isLightWallet: selectIsLightWallet(s.web3),
      verifiedEmail: selectVerifiedUserEmail(s.auth),
      backupCodesVerified: selectBackupCodesVerified(s.auth),
      requestStatus: selectKycRequestStatus(s.kyc),
      etoState: selectEtoState(s.etoFlow),
      isTermSheetSubmitted: selectIsTermSheetSubmitted(s.etoFlow),
      isPamphletSubmitted: selectIsPamphletSubmitted(s.etoFlow),
      isProspectusSubmitted: selectIsProspectusSubmitted(s.etoFlow),
      companyInformationProgress: calculateCompanyInformationProgress(selectCompanyData(s.etoFlow)),
      etoTermsProgress: calculateEtoTermsProgress(selectEtoData(s.etoFlow)),
      etoKeyIndividualsProgress: calculateEtoKeyIndividualsProgress(selectCompanyData(s.etoFlow)),
      legalInformationProgress: calculateLegalInformationProgress(selectCompanyData(s.etoFlow)),
      productVisionProgress: calculateProductVisionProgress(selectCompanyData(s.etoFlow)),
      etoMediaProgress: calculateEtoMediaProgress(selectCompanyData(s.etoFlow)),
      etoVotingRightProgress: calculateEtoVotingRightProgress(selectEtoData(s.etoFlow)),
      etoEquityTokenInfoProgress: calculateEtoEquityTokenInfoProgress(selectEtoData(s.etoFlow)),
      etoRiskAssessmentProgress: calculateEtoRiskAssessmentProgress(selectCompanyData(s.etoFlow)),
      etoInvestmentTermsProgress: calculateInvestmentTermsProgress(selectEtoData(s.etoFlow)),
      etoFormProgress: calculateGeneralEtoData(selectCombinedEtoCompanyData(s.etoFlow)),
    }),
    dispatchToProps: dispatch => ({
      loadDataStart: () => dispatch(actions.etoFlow.loadDataStart()),
      loadFileDataStart: () => dispatch(actions.etoFlow.loadFileDataStart()),
    }),
  }),
)(EtoDashboardComponent);
