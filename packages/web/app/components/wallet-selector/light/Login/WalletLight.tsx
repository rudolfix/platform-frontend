import * as React from "react";
import { compose } from "recompose";

import { selectIsLoginRoute } from "../../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../../store";
import { resetWalletOnEnter } from "../../resetWallet";
import { LoginLightWallet } from "./LoginLightWallet";

import * as styles from "./WalletLight.module.scss";

interface IStateProps {
  isLoginRoute: boolean;
}

export const WalletLightComponent: React.FunctionComponent<IStateProps> = () => (
  <section className={styles.main}>
    <LoginLightWallet />
  </section>
);

export const WalletLight = compose<IStateProps, {}>(
  resetWalletOnEnter(),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isLoginRoute: selectIsLoginRoute(s.router),
    }),
  }),
)(WalletLightComponent);
