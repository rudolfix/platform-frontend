import * as React from "react";
import { Container } from "reactstrap";

import { isLoginRoute } from "../../../modules/routing/selectors";
import { appConnect } from "../../../store";
import { RegisterLightWallet } from "./RegisterLightWallet";
import { LoginLightWallet } from "./LoginLightWallet";

interface IStateProps {
  isLoginRoute: boolean;
}

export const WalletLightComponent: React.SFC<IStateProps> = ({ isLoginRoute }) => (
  <Container>{isLoginRoute ? <LoginLightWallet /> : <RegisterLightWallet />}</Container>
);

export const WalletLight = appConnect<IStateProps>({
  stateToProps: s => ({
    isLoginRoute: isLoginRoute(s.router),
  }),
})(WalletLightComponent);
