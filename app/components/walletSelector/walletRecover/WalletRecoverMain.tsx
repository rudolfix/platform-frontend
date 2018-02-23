import * as cn from "classnames";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { LayoutRegisterLogin } from "../../layouts/LayoutRegisterLogin";
import {WalletRecoverRouter} from "./WalletRecoverRouter";

export const WalletRecoverMain: React.SFC = () => (
  <LayoutRegisterLogin>
    <Row>
      <Col>
        <WalletRecoverRouter />
      </Col>
    </Row>
  </LayoutRegisterLogin>
);
