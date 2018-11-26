import * as React from "react";

import { selectIsLoginRoute } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { LoginLightWallet } from "./LoginLightWallet";
import { RegisterLightWallet } from "./RegisterLightWallet";

import * as styles from "./WalletLight.module.scss";

interface IStateProps {
  isLoginRoute: boolean;
}

export const WalletLightComponent: React.SFC<IStateProps> = ({ isLoginRoute }) => (
  <section className={styles.section}>
    {isLoginRoute ? <LoginLightWallet /> : <RegisterLightWallet />}
  </section>
);

export const WalletLight = appConnect<IStateProps>({
  stateToProps: s => ({
    isLoginRoute: selectIsLoginRoute(s.router),
  }),
})(WalletLightComponent);
