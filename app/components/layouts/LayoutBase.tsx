import * as React from "react";
import { Col, Row } from "reactstrap";

export const LayoutBase: React.SFC = ({ children }) => (
  <div className="wrapper">
    <div className="layout-container">
      <Row>
        <Col>{children}</Col>
      </Row>
    </div>
  </div>
);
