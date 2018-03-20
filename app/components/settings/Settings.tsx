import * as React from "react";
import { Col, Row } from "reactstrap";

import { selectIsLightWallet } from "../../modules/web3/reducer";
import { appConnect } from "../../store";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { MessageSignModal } from "../modals/SignMessageModal";
import { BackupSeedWidget } from "./backupSeed/BackupSeedWidget";
import { KycStatusWidget } from "./kycStates/KycStatusWidget";
import { VerifyEmailWidget } from "./verifyEmail/VerifyEmailWidget";

interface IProps {
  isLightWallet: boolean;
}

export const SettingsComponent: React.SFC<IProps> = ({ isLightWallet }) => (
  <LayoutAuthorized>
    <MessageSignModal />
    <Row>
      <Col lg={4} xs={12}>
        <VerifyEmailWidget />
      </Col>
      {isLightWallet && (
        <Col lg={4} xs={12}>
          <BackupSeedWidget />
        </Col>
      )}
      <Col lg={4} xs={12}>
        <KycStatusWidget />
      </Col>
    </Row>
  </LayoutAuthorized>
);

export const Settings = appConnect<IProps, {}>({
  stateToProps: s => ({
    isLightWallet: selectIsLightWallet(s.web3State),
  }),
})(SettingsComponent);
