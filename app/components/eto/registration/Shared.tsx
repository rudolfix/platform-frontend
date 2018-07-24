import * as React from "react";
import { Col, Row } from "reactstrap";

import { HorizontalLine } from "../../shared/HorizontalLine";

interface ISectionProps {
  line?: boolean;
}

export const Section: React.SFC<ISectionProps> = ({ line, children }) => (
  <>
    <Row className="justify-content-center">
      <Col xs={12} lg={10} xl={10}>
        {children}
      </Col>
    </Row>
    {line && <HorizontalLine className="mb-5" />}
  </>
);
