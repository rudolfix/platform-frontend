import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { TUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectUserType } from "../../modules/auth/selectors";
import { selectKycRequestStatus } from "../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { DashboardSection } from "../eto/shared/DashboardSection";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SectionHeader } from "../shared/SectionHeader";
import { ChangeEmail } from "./changeEmail/ChangeEmail";
import { YourEthereumAddressWidget } from "./ethereumAddressWidget/YourEthereumAddressWidget";
import { CheckYourICBMWalletWidget } from "./icbmWalletWidget/CheckYourICBMWalletWidget";
import { PersonalAccountDetails } from "./personalAccountDetails/PersonalAccountDetails";
import { SettingsWidgets } from "./SettingsWidgets";

interface IStateProps {
  isLightWallet: boolean;
  userType: TUserType | undefined;
  requestKycStatus: TRequestStatus | undefined;
}

export const SettingsComponent: React.SFC<IStateProps> = ({
  isLightWallet,
  userType,
  requestKycStatus,
}) => {
  const isPersonalDataProcessed = requestKycStatus === "Pending" || requestKycStatus === "Accepted";
  const isUserInvestor = userType === "investor";

  return (
    <LayoutAuthorized>
      <Row className="row-gutter-top">
        <DashboardSection
          title={<FormattedMessage id="settings.security-settings.title" />}
          data-test-id="eto-dashboard-application"
        />
        <SettingsWidgets isDynamic={false} isLightWallet={isLightWallet} />

        <DashboardSection
          title={<FormattedMessage id="settings.account-info.title" />}
          data-test-id="eto-dashboard-application"
        />

        <Col lg={4} xs={12}>
          <YourEthereumAddressWidget />
        </Col>

        <Col lg={4} xs={12}>
          <CheckYourICBMWalletWidget />
        </Col>

        {isUserInvestor &&
          isPersonalDataProcessed && (
            <Col lg={4} xs={12}>
              <PersonalAccountDetails />
            </Col>
          )}

        {process.env.NF_FEATURE_EMAIL_CHANGE_ENABLED === "1" && (
          <>
            {/* TODO: Remove message */}
            <Col xs={12}>
              <SectionHeader>
                <FormattedMessage id="settings.personal-settings.title" />
              </SectionHeader>
            </Col>
            <Col lg={8} xs={12}>
              <ChangeEmail />
            </Col>
          </>
        )}
      </Row>
    </LayoutAuthorized>
  );
};

export const Settings = compose<React.SFC>(
  appConnect<IStateProps>({
    stateToProps: s => ({
      isLightWallet: selectIsLightWallet(s.web3),
      userType: selectUserType(s.auth),
      requestKycStatus: selectKycRequestStatus(s.kyc),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadIndividualRequest());
    },
  }),
)(SettingsComponent);
