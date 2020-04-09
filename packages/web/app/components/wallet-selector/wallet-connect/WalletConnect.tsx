import { withContainer } from "@neufund/shared";
import { StaticContext } from "react-router";
import {  RouteComponentProps } from "react-router-dom";
import { branch, compose, renderComponent } from "recompose";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../modules/actions";
import { ELogoutReason } from "../../../modules/auth/types";
import { TLoginRouterState } from "../../../modules/routing/types";
import {
  selectMessageSigningError,
  selectWalletConnectError,
} from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { shouldNeverHappen } from "../../shared/NeverComponent";
import { TMessage } from "../../translatedMessages/utils";
import { WalletConnectError } from "./WalletConnectLayout";
import { Col, Row } from "reactstrap";
import * as cn from "classnames";
import * as styles from "../WalletSelectorLayout.module.scss";
import { WalletSelectorContainer } from "../WalletSelectorContainer";
import * as React from "react";
import { TransitionalLayout } from "../../layouts/Layout";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

type TExternalProps = {
  isSecretProtected: boolean;
} & TRouteLoginProps;

type TStateProps = {
  error: TMessage | undefined;
};

type TDispatchProps = {
  walletConnectStart: () => void;
  walletConnectStop: () => void;
};

type TLocalStateProps = {
  logoutReason: ELogoutReason | undefined;
};

type TLocalStateHandlersProps = {
  hideLogoutReason: () => Partial<TLocalStateProps> | undefined;
};

const WalletConnectLayout:React.FunctionComponent = ({children}) => (
  <WalletSelectorContainer data-test-id="wallet-selector">
    <Row>
      <Col tag="section" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
        <h1 className={cn(styles.walletChooserTitle, "my-4", "text-center")}>
          <FormattedMessage id="wallet-selector.tabs.wallet-connect-login" />
        </h1>
      </Col>
    </Row>
    <section className="mt-4">
      {children}
    </section>
  </WalletSelectorContainer>
);

export const WalletConnect = compose<
  TExternalProps & TStateProps & TDispatchProps & TLocalStateHandlersProps & TLocalStateProps,
  {}
>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      error: selectWalletConnectError(state) || selectMessageSigningError(state),
    }),
    dispatchToProps: dispatch => ({
      walletConnectStart: () => dispatch(actions.walletSelector.walletConnectStart()),
      walletConnectStop: () => dispatch(actions.walletSelector.walletConnectStop()),
    }),
  }),
  withContainer(TransitionalLayout),
  withContainer(WalletConnectLayout),
  branch<TStateProps>(
    ({ error }) => error === undefined,
    renderComponent(LoadingIndicator),
    renderComponent(WalletConnectError),
  ),
)(shouldNeverHappen("WalletConnect reached default branch"));
