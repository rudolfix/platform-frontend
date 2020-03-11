import { createLocation, Location } from "history";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { compose, withProps } from "recompose";

import { EUserType } from "../../../lib/api/users/interfaces";
import { actions } from "../../../modules/actions";
import { ELogoutReason } from "../../../modules/auth/types";
import { TLoginRouterState } from "../../../modules/routing/types";
import {
  selectIsLoginRoute,
  selectLedgerConnectionEstablished,
  selectRootPath,
  selectUrlUserType,
} from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { EContentWidth } from "../../layouts/Content";
import { FullscreenProgressLayout } from "../../layouts/FullscreenProgressLayout";
import { TransitionalLayout } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { EWarningAlertLayout, EWarningAlertSize, WarningAlert } from "../../shared/WarningAlert";
import { LedgerErrorMessage } from "../../translatedMessages/messages";
import { ICBMWalletHelpTextModal } from "./ICBMWalletHelpTextModal";
import { getRedirectionUrl, userMayChooseWallet } from "./utils";
import { WalletLoginRouter } from "./WalletLoginRouter";

import * as styles from "../shared/RegisterWalletSelector.module.scss";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

interface IStateProps {
  rootPath: string;
  isLoginRoute: boolean;
  userType: EUserType;
  ledgerConnectionEstablished: boolean;
}

interface IDispatchProps {
  closeAccountChooser: () => void;
  openICBMModal: () => void;
}

type TAdditionalProps = {
  showWalletSelector: boolean;
  showLogoutReason: boolean;
  redirectLocation: Location;
};

interface IExternalProps {
  rootPath: string;
  openICBMModal: () => void;
  showWalletSelector: boolean;
  showLogoutReason: boolean;
  redirectLocation: Location;
}

export const WalletSelectorLoginBase: React.FunctionComponent<IStateProps &
  IDispatchProps &
  TAdditionalProps &
  IExternalProps> = ({
  rootPath,
  redirectLocation,
  showWalletSelector,
  showLogoutReason,
  ledgerConnectionEstablished,
  closeAccountChooser,
  ...props
}) => {
  const routes = (
    <WalletLoginRouter
      rootPath={rootPath}
      redirectLocation={redirectLocation}
      showWalletSelector={showWalletSelector}
    />
  );

  if (ledgerConnectionEstablished) {
    return (
      <FullscreenProgressLayout
        wrapperClass={styles.fullscreenProgressLayout}
        width={EContentWidth.FULL}
        buttonProps={{
          buttonText: <FormattedMessage id="account-recovery.step.cancel" />,
          buttonAction: closeAccountChooser,
        }}
        {...props}
      >
        {routes}
      </FullscreenProgressLayout>
    );
  }

  return (
    <TransitionalLayout isLoginRoute width={EContentWidth.SMALL} {...props}>
      {showLogoutReason && (
        <WarningAlert
          className={styles.logoutNotification}
          size={EWarningAlertSize.BIG}
          layout={EWarningAlertLayout.INLINE}
          data-test-id="wallet-selector-session-timeout-notification"
        >
          <FormattedHTMLMessage tagName="span" id="notifications.auth-session-timeout" />
        </WarningAlert>
      )}
      <div className={styles.wrapper} data-test-id="wallet-selector">
        {routes}
      </div>
    </TransitionalLayout>
  );
};

export const WalletSelectorLogin = compose<IStateProps & IDispatchProps & TAdditionalProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      rootPath: selectRootPath(s.router),
      isLoginRoute: selectIsLoginRoute(s.router),
      userType: selectUrlUserType(s.router),
      ledgerConnectionEstablished: selectLedgerConnectionEstablished(s),
    }),
    dispatchToProps: dispatch => ({
      openICBMModal: () => dispatch(actions.genericModal.showModal(ICBMWalletHelpTextModal)),
      closeAccountChooser: () => {
        dispatch(actions.walletSelector.ledgerCloseAccountChooser());
        dispatch(
          actions.walletSelector.ledgerConnectionEstablishedError({
            messageType: LedgerErrorMessage.USER_CANCELLED,
          }),
        );
      },
    }),
  }),
  withProps<TAdditionalProps, IStateProps & TRouteLoginProps>(
    ({ userType, ledgerConnectionEstablished, rootPath, location }) => ({
      showWalletSelector: userMayChooseWallet(userType) && !ledgerConnectionEstablished,
      showLogoutReason: !!(
        location.state && location.state.logoutReason === ELogoutReason.SESSION_TIMEOUT
      ),
      redirectLocation: createLocation(getRedirectionUrl(rootPath), location.state),
    }),
  ),
)(WalletSelectorLoginBase);
