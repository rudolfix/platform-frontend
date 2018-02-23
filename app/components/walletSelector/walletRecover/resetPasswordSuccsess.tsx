import * as React from "react";
import { Col, Row } from "reactstrap";
import { LayoutRegisterLogin } from "../../layouts/LayoutRegisterLogin";
import { StandardButton } from "../../shared/StandardButton";
import { WalletResetHeader } from "./WalletResetHeader";

export const WalletLoginHelp: React.SFC<void> = () => (
  <div>
    <LayoutRegisterLogin>
      <Col className="mt-4 pb-5">
        <WalletResetHeader steps={5} currentStep={5} text={"Lorem ipsum"} />
      </Col>
      <Col className="mt-4 mb-5 mx-auto">
        <h5 className="text-center">
          <i className="fa fa-check-circle mr-1" /> Great, you have a new password!
        </h5>
      </Col>
      <Row className="justify-content-center mb-5 mt-5 pt-4">
        <Col xs={6} sm={5} md={4} lg={3}>
          <StandardButton text="GO TO DASHBOARD" />
        </Col>
      </Row>
      <Row className="justify-content-end mt-4 pt-4 align-bottom" noGutters>
        <Col className="align-bottom text-end">
          <div className="mt-5 align-bottom font-weight-bold text-right">
            Contact for help <i className="fa fa-lg fa-angle-right ml-1" />
          </div>
        </Col>
      </Row>
    </LayoutRegisterLogin>
  </div>
);
