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
import { etoFlowInitialState } from "../../modules/eto-flow/reducer";
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
  etoFormProgress?: number;
  isEmailVerified?: boolean;
  etoState?: EtoState;
}

interface IDispatchProps {
  loadDataStart: () => void;
}

type IProps = IStateProps;

class EtoDashboardComponent extends React.Component<any> {
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
      etoFormProgress,
      loadDataStart,
      kycStatus,
      isEmailVerified,
      etoState,
    } = this.props;

    const isVerificationSectionDone = !!(
      verifiedEmail &&
      backupCodesVerified &&
      requestStatus === "Accepted"
    );

    const shouldEtoDataLoad = kycStatus === "Accepted" && isEmailVerified;

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
          {etoFormProgress > SUBMIT_PROPOSAL_THRESHOLD &&
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
              <ETOFormsProgressSection {...this.props} />
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
        etoFlowInitialState,
      ),
      etoTermsProgress: selectFormFractionDone(
        EtoTermsType.toYup(),
        s.etoFlow.etoData,
        etoFlowInitialState,
      ),
      etoKeyIndividualsProgress: selectFormFractionDone(
        EtoKeyIndividualsType.toYup(),
        s.etoFlow.companyData,
        etoFlowInitialState,
      ),
      legalInformationProgress: selectFormFractionDone(
        EtoLegalInformationType.toYup(),
        s.etoFlow.companyData,
        etoFlowInitialState,
      ),
      productVisionProgress: selectFormFractionDone(
        EtoProductVisionType.toYup(),
        s.etoFlow.companyData,
        etoFlowInitialState,
      ),
      etoMediaProgress: selectFormFractionDone(
        EtoMediaType.toYup(),
        s.etoFlow.companyData,
        etoFlowInitialState,
      ),
      etoFormProgress: selectFormFractionDone(
        TGeneralEtoDataType.toYup(),
        { ...s.etoFlow.companyData, ...s.etoFlow.etoData },
        etoFlowInitialState,
      ),
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
