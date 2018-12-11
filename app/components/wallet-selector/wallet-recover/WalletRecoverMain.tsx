import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { withContainer } from "../../../utils/withContainer";
import { LayoutRegisterLogin } from "../../layouts/LayoutRegisterLogin";
import { LayoutUnauthorized } from "../../layouts/LayoutUnauthorized";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutUnauthorized } from "../../shared/errorBoundary/ErrorBoundaryLayoutUnauthorized";
import { RecoverRouter } from "./RecoverRouter";

export const WalletRecoverMainComponent: React.SFC = () => (
  <LayoutRegisterLogin>
    <Row>
      <Col>
        <RecoverRouter />
      </Col>
    </Row>
  </LayoutRegisterLogin>
);

export const WalletRecoverMain: React.SFC = compose<React.SFC>(
  createErrorBoundary(ErrorBoundaryLayoutUnauthorized),
  withContainer(LayoutUnauthorized),
)(WalletRecoverMainComponent);
