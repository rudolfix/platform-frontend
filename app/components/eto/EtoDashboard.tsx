import * as React from "react";
import { Col, Row } from "reactstrap";

import { compose } from "redux";
import {
  EtoCompanyInformationType,
  EtoKeyIndividualsType,
  EtoLegalInformationType,
  EtoMediaType,
  EtoProductVisionType,
  EtoState,
  EtoTermsType,
  TGeneralEtoDataType,
} from "../../lib/api/EtoApi.interfaces";
import { TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import {
  selectBackupCodesVerified,
  selectIsUserEmailVerified,
  selectVerifiedUserEmail,
} from "../../modules/auth/selectors";
import { selectEtoState, selectFormFractionDone } from "../../modules/eto-flow/selectors";
import { selectKycRequestStatus, selectWidgetLoading } from "../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SettingsWidgets } from "../settings/SettingsWidgets";
import { SubmitProposalWidget } from "../settings/submitProposalWidget/SubmitProposalWidget";
import { ETOFormsProgressSection } from "./dashboard/ETOFormsProgressSection";
import { DashboardSection } from "./shared/DashboardSection";

const SUBMIT_PROPOSAL_THRESHOLD = 0.9;

interface IStateProps {
  isLightWallet: boolean;
  verifiedEmail?: string;
  backupCodesVerified?: boolean;
  requestStatus?: TRequestStatus;
  isEmailVerified?: boolean;
  etoState?: EtoState;
  kycStatus?: TRequestStatus;
  etoFormProgress?: number;
  productVisionProgress?: number;
  legalInformationProgress?: number;
  etoKeyIndividualsProgress?: number;
  etoTermsProgress?: number;
  companyInformationProgress?: number;
  etoMediaProgress?: number;
  etoRiskProgress?: number;
  loadingData: boolean;
  businessRequestStateLoading: boolean;
}

interface IDispatchProps {
  loadDataStart: () => void;
}

type IProps = IStateProps & IDispatchProps;

class EtoDashboardComponent extends React.Component<IProps> {
  // TODO: REMOVE ANY
  componentDidMount(): void {
    const { kycStatus, isEmailVerified, loadDataStart } = this.props;

    const shouldEtoDataLoad = kycStatus === "Accepted" && isEmailVerified;
    if (shouldEtoDataLoad) {
      loadDataStart();
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
      etoFormProgress,
      productVisionProgress,
      legalInformationProgress,
      etoKeyIndividualsProgress,
      etoTermsProgress,
      companyInformationProgress,
      etoMediaProgress,
      etoRiskProgress,
      loadingData,
      businessRequestStateLoading,
    } = this.props;

    const etoProgressProps = {
      companyInformationProgress: companyInformationProgress ? companyInformationProgress : 0,
      productVisionProgress: productVisionProgress ? productVisionProgress : 0,
      legalInformationProgress: legalInformationProgress ? legalInformationProgress : 0,
      etoKeyIndividualsProgress: etoKeyIndividualsProgress ? etoKeyIndividualsProgress : 0,
      etoTermsProgress: etoTermsProgress ? etoTermsProgress : 0,
      etoMediaProgress: etoMediaProgress ? etoMediaProgress : 0,
      etoRiskProgress: etoRiskProgress ? etoRiskProgress : 0,
      loadingData,
      businessRequestStateLoading,
      kycStatus,
      isEmailVerified,
    };

    const isVerificationSectionDone = !!(
      verifiedEmail &&
      backupCodesVerified &&
      requestStatus === "Accepted"
    );

    return (
      <LayoutAuthorized>
        <Row className="row-gutter-top">
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
          {etoFormProgress &&
            etoFormProgress > SUBMIT_PROPOSAL_THRESHOLD &&
            etoState === "preview" && (
              <>
                <DashboardSection
                  step={3}
                  title="SUBMIT PROPOSAL"
                  data-test-id="eto-dashboard-verification"
                />
                <Col lg={4} xs={12}>
                  <SubmitProposalWidget />
                </Col>
              </>
            )}
          {etoState === "preview" && (
            <>
              <DashboardSection
                step={2}
                title="ETO APPLICATION"
                data-test-id="eto-dashboard-application"
              />
              <ETOFormsProgressSection {...etoProgressProps} />
            </>
          )}
        </Row>
      </LayoutAuthorized>
    );
  }
}

export const EtoDashboard = compose<React.SFC>(
  appConnect<any, IDispatchProps>({
    stateToProps: s => ({
      companyInformationProgress: selectFormFractionDone(
        EtoCompanyInformationType.toYup(),
        s.etoFlow.companyData,
      ),
      etoTermsProgress: selectFormFractionDone(EtoTermsType.toYup(), s.etoFlow.etoData),
      etoKeyIndividualsProgress: selectFormFractionDone(
        EtoKeyIndividualsType.toYup(),
        s.etoFlow.companyData,
      ),
      legalInformationProgress: selectFormFractionDone(
        EtoLegalInformationType.toYup(),
        s.etoFlow.companyData,
      ),
      productVisionProgress: selectFormFractionDone(
        EtoProductVisionType.toYup(),
        s.etoFlow.companyData,
      ),
      etoMediaProgress: selectFormFractionDone(EtoMediaType.toYup(), s.etoFlow.companyData),
      etoFormProgress: selectFormFractionDone(TGeneralEtoDataType.toYup(), {
        ...s.etoFlow.companyData,
        ...s.etoFlow.etoData,
      }),
      loadingData: s.etoFlow.loading,
      kycStatus: selectKycRequestStatus(s.kyc),
      isEmailVerified: selectIsUserEmailVerified(s.auth),
      businessRequestStateLoading: selectWidgetLoading(s.kyc),
      isLightWallet: selectIsLightWallet(s.web3),
      verifiedEmail: selectVerifiedUserEmail(s.auth),
      backupCodesVerified: selectBackupCodesVerified(s.auth),
      requestStatus: selectKycRequestStatus(s.kyc),
      etoState: selectEtoState(s.etoFlow),
    }),
    dispatchToProps: dispatch => ({
      loadDataStart: () => dispatch(actions.etoFlow.loadDataStart()),
    }),
  }),
)(EtoDashboardComponent);
