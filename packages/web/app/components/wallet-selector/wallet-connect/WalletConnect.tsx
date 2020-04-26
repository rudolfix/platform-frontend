import { Button, EButtonLayout } from "@neufund/design-system";
import { TDataTestId, withContainer } from "@neufund/shared-utils";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../modules/actions";
import { ELogoutReason } from "../../../modules/auth/types";
import { TLoginRouterState } from "../../../modules/routing/types";
import {
  selectMessageSigningError,
  selectWalletConnectError,
} from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { TransitionalLayout } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { shouldNeverHappen } from "../../shared/NeverComponent";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";

import * as styles from "./WalletConnect.module.scss";

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

type TErrorProps = {
  error: TMessage;
  walletConnectStart: () => void;
};

export const WalletConnectError: React.FunctionComponent<TErrorProps> = ({
  error,
  walletConnectStart,
}) => (
  <>
    <div>{getMessageTranslation(error)}</div>
    <Button
      layout={EButtonLayout.PRIMARY}
      type="button"
      onClick={walletConnectStart}
      data-test-id="eto-flow-start-bookbuilding"
    >
      retry
    </Button>
  </>
);

export const WalletSelectorContainer: React.FunctionComponent<TDataTestId> = ({
  children,
  "data-test-id": dataTestId,
}) => (
  <div data-test-id={dataTestId} className={styles.walletSelectorContainer}>
    {children}
  </div>
);

const WalletConnectLayout: React.FunctionComponent = ({ children }) => (
  <WalletSelectorContainer data-test-id="wallet-selector">
    <Row>
      <Col tag="section" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
        <h1 className={cn(styles.walletChooserTitle, "my-4", "text-center")}>
          <FormattedMessage id="wallet-selector.tabs.wallet-connect-login" />
        </h1>
      </Col>
    </Row>
    <section className="mt-4">{children}</section>
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
