import * as React from "react";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { MessageSignModal } from "../modals/SignMessageModal";
import { ArrowLink } from "../shared/ArrowLink";
import { PanelDark } from "../shared/PanelDark";
import { VerifyEmailWidget } from "./verifyEmail/VerifyEmailWidget";

export const Settings = () => (
  <LayoutAuthorized>
    <MessageSignModal />
    <Row className="p-3">
      <Col lg={4} xs={12}>
        <VerifyEmailWidget />
      </Col>
      <Col lg={4} xs={12}>
        <PanelDark headerText="BACKUP RECOVERY PHRASE" className="bg-white w-100">
          <p className="mt-3 mb-5 ml-1 mr-1">
            Write down your recovery phrase and keep it safe and secure. Your recovery Phrase allows
            you to restore your wallet and access your funds you forgot your password
          </p>
          <ArrowLink arrowDirection="right" to="#" className="mb-4 d-flex justify-content-center">
            Backup phrase
          </ArrowLink>
        </PanelDark>
      </Col>
      <Col lg={4} xs={12}>
        <PanelDark headerText="KYC PROCESS" className="bg-white w-100">
          <p className="mt-3 mb-5 ml-1 mr-1">
            Write down your recovery phrase and keep it safe and secure. Your recovery Phrase allows
            you to restore your wallet and access your funds you forgot your password
          </p>
          <ArrowLink arrowDirection="right" to="#" className="mb-4 d-flex justify-content-center">
            Verify KYC
          </ArrowLink>
        </PanelDark>
      </Col>
    </Row>
  </LayoutAuthorized>
);
