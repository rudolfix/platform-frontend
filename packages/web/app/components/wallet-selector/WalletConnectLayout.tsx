import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { StaticContext } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { ELogoutReason } from "../../modules/auth/types";
import { TLoginRouterState } from "../../modules/routing/types";
import { appRoutes } from "../appRoutes";
import { WalletSelectorContainer } from "./WalletSelectorContainer";

import * as styles from "./WalletSelectorLayout.module.scss";
import { Button, EButtonLayout, EIconPosition } from "@neufund/design-system";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

interface IExternalProps {
  rootPath: string;
  isLoginRoute: boolean;
  oppositeRoute: string;
  userType: string;
  openICBMModal: () => void;
  isSecretProtected: boolean;
  logoutReason: ELogoutReason | undefined;
  hideLogoutReason: () => Partial<{ logoutReason: ELogoutReason | undefined }> | undefined;
}

export const WalletConnectLayout: React.FunctionComponent<IExternalProps & TRouteLoginProps> = ({ connectToBridge }) => {

  return (
    <WalletSelectorContainer data-test-id="wallet-selector">

      <h1 className={cn(styles.walletChooserTitle, "my-4", "text-center")}>
        Wallet connect
      </h1>
      <Button
        layout={EButtonLayout.PRIMARY}
        onClick={connectToBridge}
      >
        start connection
      </Button>
    </WalletSelectorContainer>
  );
};
