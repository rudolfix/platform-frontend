import { withContainer } from "@neufund/shared";
import { createLocation, Location } from "history";
import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { compose, withProps } from "recompose";

import { EUserType } from "../../../lib/api/users/interfaces";
import { actions } from "../../../modules/actions";
import { ELogoutReason } from "../../../modules/auth/types";
import { TLoginRouterState } from "../../../modules/routing/types";
import { selectIsLoginRoute, selectRootPath, selectUrlUserType } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { EContentWidth } from "../../layouts/Content";
import { TContentExternalProps, TransitionalLayout } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { EWarningAlertLayout, EWarningAlertSize, WarningAlert } from "../../shared/WarningAlert";
import { ICBMWalletHelpTextModal } from "./ICBMWalletHelpTextModal";
import * as styles from "../shared/RegisterWalletSelector.module.scss";
import { getRedirectionUrl, userMayChooseWallet } from "./utils";
import { WalletLoginRouter } from "./WalletLoginRouter";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

interface IStateProps {
  rootPath: string;
  isLoginRoute: boolean;
  userType: EUserType;
}

interface IDispatchProps {
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

export const WalletSelectorLoginBase: React.FunctionComponent<IExternalProps> = ({
  rootPath,
  redirectLocation,
  showWalletSelector,
  showLogoutReason,
}) => (
  <>
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
      <div className={styles.wrapper} data-test-id="wallet-selector">
        <WalletLoginRouter
          rootPath={rootPath}
          redirectLocation={redirectLocation}
          showWalletSelector={showWalletSelector}
        />
      </div>
    </div>
  </>
);

export const WalletSelectorLogin = compose<IStateProps & IDispatchProps & TAdditionalProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      rootPath: selectRootPath(s.router),
      isLoginRoute: selectIsLoginRoute(s.router),
      userType: selectUrlUserType(s.router),
    }),
    dispatchToProps: dispatch => ({
      openICBMModal: () => dispatch(actions.genericModal.showModal(ICBMWalletHelpTextModal)),
    }),
  }),
  withProps<TAdditionalProps, IStateProps & TRouteLoginProps>(
    ({ userType, rootPath, location }) => ({
      showWalletSelector: userMayChooseWallet(userType),
      showLogoutReason: !!(
        location.state && location.state.logoutReason === ELogoutReason.SESSION_TIMEOUT
      ),
      redirectLocation: createLocation(getRedirectionUrl(rootPath), location.state),
    }),
  ),
  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(TransitionalLayout),
  ),
)(WalletSelectorLoginBase);
