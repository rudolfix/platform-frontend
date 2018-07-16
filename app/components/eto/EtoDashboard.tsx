import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EtoState,
  TGeneralEtoDataType,
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
} from "../../lib/api/EtoApi.interfaces";
import { TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import {
  selectBackupCodesVerified,
  selectIsUserEmailVerified,
  selectVerifiedUserEmail,
} from "../../modules/auth/selectors";
import {
  selectCombinedEtoCompanyData,
  selectCompanyData,
  selectEtoData,
  selectEtoState,
  selectFormFractionDone,
} from "../../modules/eto-flow/selectors";
import { selectKycRequestStatus, selectWidgetLoading } from "../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { BookBuildingWidget } from "../settings/bookBuildingWidget/BookBuildingWidget";
import { ChoosePreEtoDateWidget } from "../settings/choosePreEtoDateWidget/ChoosePreEtoDateWidget";
import { SettingsWidgets } from "../settings/SettingsWidgets";
import { SubmitProposalWidget } from "../settings/submitProposalWidget/SubmitProposalWidget";
import { UploadProspectusWidget } from "../settings/uploadProspectusWidget/UploadProspectusWidget";
import { EtoProjectState } from "../shared/EtoProjectStatus";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { ETOFormsProgressSection } from "./dashboard/ETOFormsProgressSection";
import { DashboardSection } from "./shared/DashboardSection";

const SUBMIT_PROPOSAL_THRESHOLD = 0.5;

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
  businessRequestStateLoading: boolean;
  companyData: TPartialCompanyEtoData;
  etoData: TPartialEtoSpecData;
}

interface IDispatchProps {
  loadDataStart: () => void;
}

type IProps = IStateProps & IDispatchProps;

class EtoDashboardComponent extends React.Component<IProps> {
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
      isLightWallet,
      etoFormProgress,
      loadingData,
      companyData,
      etoData,
      businessRequestStateLoading,
    } = this.props;

    const etoProgressProps = {
      loadingData,
      businessRequestStateLoading,
      kycStatus,
      isEmailVerified,
      companyData,
      etoData,
    };

    const isVerificationSectionDone = !!(
      verifiedEmail &&
      (backupCodesVerified || !isLightWallet) &&
      requestStatus === "Accepted"
    );
    return (
      <LayoutAuthorized>
        <Row className="row-gutter-top">
          {loadingData ? (
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
              {etoState === "preview" &&
                etoFormProgress &&
                etoFormProgress > SUBMIT_PROPOSAL_THRESHOLD && (
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
              {(etoState === "pending" || etoState === "listed") && (
                <>
                  <DashboardSection
                    hasDecorator={false}
                    title={<EtoProjectState status={etoState} />}
                    data-test-id="eto-dashboard-application"
                  />
                  <Col lg={4} xs={12}>
                    {/* TODO: Add visibility logic for BookBuildingWidget*/}
                    <BookBuildingWidget />
                  </Col>
                  <Col lg={4} xs={12}>
                    {/* TODO: Add visibility logic for UploadProspectusWidget*/}
                    <UploadProspectusWidget />
                  </Col>
                  {/* TODO: Add visibility logic for ChoosePreEtoDateWidget*/}
                  <Col lg={4} xs={12}>
                    <ChoosePreEtoDateWidget />
                  </Col>

                  <Col xs={12}>
                    <FormattedMessage id="eto-dashboard-application-description" />
                  </Col>
                  <ETOFormsProgressSection {...etoProgressProps} />
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
  appConnect<any, IDispatchProps>({
    stateToProps: s => ({
      etoFormProgress: selectFormFractionDone(
        TGeneralEtoDataType.toYup(),
        selectCombinedEtoCompanyData(s.etoFlow),
      ),
      companyData: selectCompanyData(s.etoFlow),
      etoData: selectEtoData(s.etoFlow),
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
