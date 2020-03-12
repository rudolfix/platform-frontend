import * as cn from "classnames";
import * as React from "react";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { ELogoutReason } from "../../../modules/auth/types";
import { TLoginRouterState } from "../../../modules/routing/types";
import { WalletSelectorContainer } from "../WalletSelectorContainer";

import * as styles from "../WalletSelectorLayout.module.scss";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

interface IExternalProps {
  error: TMessage,
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
  error
}) =>

  (
    <WalletSelectorContainer data-test-id="wallet-selector">

      <h1 className={cn(styles.walletChooserTitle, "my-4", "text-center")}>
        Wallet connect
      </h1>
      {error ?
        <div>{getMessageTranslation(error)}</div>
        : <LoadingIndicator/>}
    </WalletSelectorContainer>
  );

