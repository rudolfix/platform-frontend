import * as React from "react";
import { Col, Row } from "reactstrap";
import { LayoutRegisterLogin } from "../../layouts/LayoutRegisterLogin";
import { RecoverRouter } from "./RecoverRouter";

export const WalletRecoverMain: React.SFC = () => (
  <LayoutRegisterLogin>
    <Row>
      <Col>
        <RecoverRouter />
      </Col>
    </Row>
  </LayoutRegisterLogin>
);
