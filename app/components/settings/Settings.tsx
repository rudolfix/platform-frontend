import * as React from "react";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { MessageSignModal } from "../modals/SignMessageModal";
import { BackupSeedWidget } from "./backupSeed/BackupSeedWidget";
import { KycStatusWidget } from "./kycStates/KycStatusWidget";
import { VerifyEmailWidget } from "./verifyEmail/VerifyEmailWidget";

export const Settings = () => (
  <LayoutAuthorized>
    <MessageSignModal />
    <Row className="p-3">
      <Col lg={4} xs={12}>
        <VerifyEmailWidget />
      </Col>
      <Col lg={4} xs={12}>
        <BackupSeedWidget />
      </Col>
      <Col lg={4} xs={12}>
        <KycStatusWidget />
      </Col>
    </Row>
  </LayoutAuthorized>
);
