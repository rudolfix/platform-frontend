import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SectionHeader } from "../shared/SectionHeader";
import { ChangeEmail } from "./changeEmail/ChangeEmail";
import { YourEthereumAddressWidget } from "./ethereumAddressWidget/YourEthereumAddressWidget";
import { SettingsWidgets } from "./SettingsWidgets";

export const Settings: React.SFC = () => {
  return (
    <LayoutAuthorized>
      <Row className="row-gutter-top">
        <Col xs={12}>
          <SectionHeader>
            <FormattedMessage id="settings.security-settings.title" />
          </SectionHeader>
        </Col>
        <SettingsWidgets />
        <Col xs={12}>
          <SectionHeader>
            <FormattedMessage id="settings.account-info.title" />
          </SectionHeader>
        </Col>

        <Col lg={4} xs={12}>
          <YourEthereumAddressWidget />
        </Col>

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
