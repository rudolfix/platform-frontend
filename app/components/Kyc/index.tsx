import * as React from "react";
import { KycRouter } from "./Router";

import { Container, Row } from "reactstrap";

export const Kyc: React.SFC = () => (
  <Container>
    <Row>
      <h1>Kyc</h1>
    </Row>
    <Row>
      <KycRouter />
    </Row>
  </Container>
);
