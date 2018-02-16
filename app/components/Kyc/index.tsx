import * as React from "react";
import { KycRouter } from "./Router";

import * as cn from "classnames";
import { Col, Container, Row } from "reactstrap";

import * as styles from "./Kyc.module.scss";

export const Kyc: React.SFC = () => (
  <Container>
    <Row>
      <Col lg="12" xl={{ size: "10", offset: 1 }} className={cn("p-4", styles.container)}>
        <KycRouter />
      </Col>
    </Row>
  </Container>
);
