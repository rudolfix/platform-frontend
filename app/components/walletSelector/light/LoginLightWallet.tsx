import * as React from "react";
import { Col, Row } from "reactstrap";
import { isLightWalletReadyToLogin } from "../../../modules/web3/reducer";
import { appConnect } from "../../../store";
import { LoginWithEmailLightWallet } from "./LoginWithEmailLightWallet";
import { MissingEmailLightWallet } from "./MissingEmailLightWallet";

interface IStateProps {
  readyToLogin: boolean;
}

export const LoginLightWalletComponent: React.SFC<IStateProps> = ({ readyToLogin }) => (
  <Row className="justify-content-sm-center mb-5">
    <Col xs="12" md="5" className="align-self-end">
      <h1 className="text-center mb-4">Welcome back!</h1>

      {readyToLogin ? <LoginWithEmailLightWallet /> : <MissingEmailLightWallet />}
    </Col>
  </Row>
);

export const LoginLightWallet = appConnect<IStateProps>({
  stateToProps: s => ({
    readyToLogin: isLightWalletReadyToLogin(s.web3State),
  }),
})(LoginLightWalletComponent);
