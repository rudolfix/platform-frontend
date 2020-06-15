import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { selectIsAuthorized } from "../../modules/auth/selectors";
import { appConnect } from "../../store";
import { TDataTestId } from "../../types";
import { NotificationWidget } from "../shared/notification-widget/NotificationWidget";
import { EWarningAlertSize, WarningAlert } from "../shared/WarningAlert";
import { Content } from "./Content";
import { Footer } from "./Footer";
import { HeaderAuthorized, HeaderTransitional, HeaderUnauthorized } from "./header/Header";
import { LayoutContainer } from "./LayoutContainer";

import * as styles from "./Layout.module.scss";

interface IStateProps {
  userIsAuthorized: boolean;
}

interface ILayoutUnauthProps {
  hideHeaderCtaButtons?: boolean;
}

type TTransitionalLayoutProps = TContentExternalProps & {
  isLoginRoute: boolean;
  showLogoutReason: boolean;
} & ILayoutUnauthProps;

type TContentExternalProps = React.ComponentProps<typeof Content>;

const LayoutUnauthorized: React.FunctionComponent<ILayoutUnauthProps & TContentExternalProps> = ({
  children,
  ...contentProps
}) => (
  <>
    <HeaderUnauthorized />
    <Content {...contentProps}>{children}</Content>
    <Footer />
  </>
);

const LayoutAuthorized: React.FunctionComponent<TContentExternalProps> = ({
  children,
  ...contentProps
}) => (
  <>
    <HeaderAuthorized />
    <Content {...contentProps}>
      <NotificationWidget />
      {children}
    </Content>
    <Footer />
  </>
);

const LayoutComponent: React.FunctionComponent<IStateProps &
  TDataTestId &
  TContentExternalProps &
  ILayoutUnauthProps> = ({
  children,
  userIsAuthorized,
  "data-test-id": dataTestId,
  ...contentProps
}) => (
  <LayoutContainer data-test-id={dataTestId} userIsAuthorized={userIsAuthorized}>
    {userIsAuthorized ? (
      <LayoutAuthorized {...contentProps}>{children}</LayoutAuthorized>
    ) : (
      <LayoutUnauthorized {...contentProps}>{children}</LayoutUnauthorized>
    )}
  </LayoutContainer>
);

const Layout = compose<IStateProps, TDataTestId & TContentExternalProps & ILayoutUnauthProps>(
  appConnect<IStateProps, {}, {}>({
    stateToProps: state => ({
      userIsAuthorized: selectIsAuthorized(state),
    }),
  }),
)(LayoutComponent);

const TransitionalLayout: React.FunctionComponent<TDataTestId & TTransitionalLayoutProps> = ({
  children,
  "data-test-id": dataTestId,
  showLogoutReason,
  ...contentProps
}) => (
  <LayoutContainer
    data-test-id={dataTestId}
    className={styles.layoutTransitional}
    userIsAuthorized={false}
  >
    <HeaderTransitional isLoginRoute={contentProps.isLoginRoute} />
    {showLogoutReason && (
      <WarningAlert
        className={styles.logoutNotification}
        size={EWarningAlertSize.BIG}
        data-test-id="wallet-selector-session-timeout-notification"
      >
        <FormattedHTMLMessage tagName="span" id="notifications.auth-session-timeout" />
      </WarningAlert>
    )}
    <Content {...contentProps}>{children}</Content>
    <Footer />
  </LayoutContainer>
);

export {
  Layout,
  TransitionalLayout,
  LayoutComponent,
  LayoutAuthorized,
  LayoutUnauthorized,
  ILayoutUnauthProps,
  TContentExternalProps,
  TTransitionalLayoutProps,
};
