import * as React from "react";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../../layouts/LayoutAuthorized";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

export const EtoRegister = () => (
  <LayoutAuthorized>
    <Row>
      <Col xs={12} lg={{ size: 8, offset: 2 }}>
        <EtoRegistrationPanel />
      </Col>
    </Row>
  </LayoutAuthorized>
);
