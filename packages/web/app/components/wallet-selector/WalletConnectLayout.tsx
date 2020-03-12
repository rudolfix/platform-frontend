import { Button, EButtonLayout } from "@neufund/design-system";
import * as cn from "classnames";
import * as React from "react";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { ELogoutReason } from "../../modules/auth/types";
import { TLoginRouterState } from "../../modules/routing/types";
import { WalletSelectorContainer } from "./WalletSelectorContainer";

import * as styles from "./WalletSelectorLayout.module.scss";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

interface IExternalProps {
  rootPath: string;
  isLoginRoute: boolean;
  oppositeRoute: string;
  userType: string;
  walletConnectStart: () => void;
  walletConnectStop: () => void;
  isSecretProtected: boolean;
  logoutReason: ELogoutReason | undefined;
  hideLogoutReason: () => Partial<{ logoutReason: ELogoutReason | undefined }> | undefined;
}

export const WalletConnectLayout: React.FunctionComponent<IExternalProps & TRouteLoginProps> = ({
  walletConnectStop,
  walletConnectStart
}) =>

  (
    <WalletSelectorContainer data-test-id="wallet-selector">

      <h1 className={cn(styles.walletChooserTitle, "my-4", "text-center")}>
        Wallet connect
      </h1>
      <Button
        layout={EButtonLayout.PRIMARY}
        onClick={walletConnectStart}
      >
        start connection
      </Button>
      <Button
        layout={EButtonLayout.PRIMARY}
        onClick={walletConnectStop}
      >
        stop connection
      </Button>
    </WalletSelectorContainer>
  );
