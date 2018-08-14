import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { DashboardSection } from "../eto/shared/DashboardSection";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SectionHeader } from "../shared/SectionHeader";
import { ChangeEmail } from "./changeEmail/ChangeEmail";
import { YourEthereumAddressWidget } from "./ethereumAddressWidget/YourEthereumAddressWidget";
import { CheckYourICBMWalletWidget } from "./icbmWalletWidget/CheckYourICBMWalletWidget";
import { SettingsWidgets } from "./SettingsWidgets";

interface IStateProps {
  isLightWallet: boolean;
}

export const SettingsComponent: React.SFC<IStateProps> = ({ isLightWallet }) => {
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
        {process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED === "1" && (
          <Col lg={4} xs={12}>
            <CheckYourICBMWalletWidget />
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
    }),
  }),
)(SettingsComponent);
