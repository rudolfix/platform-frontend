import { withContainer } from "@neufund/shared";
import { createLocation, Location } from "history";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { branch, compose, renderComponent, renderNothing, withProps } from "recompose";

import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { ELogoutReason } from "../../modules/auth/types";
import { TLoginRouterState } from "../../modules/routing/types";
import {
  selectIsLoginRoute, selectRegisterWithBrowserWalletData,
  selectRootPath,
  selectUrlUserType,
} from "../../modules/wallet-selector/selectors";
import { appConnect } from "../../store";
import { EContentWidth } from "../layouts/Content";
import { TContentExternalProps, TransitionalLayout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { ICBMWalletHelpTextModal } from "./ICBMWalletHelpTextModal";
import { resetWalletOnLeave } from "./resetWallet";
import { userMayChooseWallet } from "./utils";
import { getRedirectionUrl } from "./walletRouterHelpers";
import { WalletSelectorLoginLayout, WalletSelectorRegisterLayout } from "./WalletSelectorLayout";
import { shouldNeverHappen } from "../shared/NeverComponent";
import { EBrowserWalletState, TWalletRegisterData } from "../../modules/wallet-selector/reducer";
import { BrowserWallet } from "../../lib/web3/browser-wallet/BrowserWallet";
import { EWalletType } from "../../modules/web3/types";
import { BrowserWalletComponent, LedgerWalletComponent, LightWalletComponent } from "./WalletRouter";
import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";
import { MetamaskError, WalletBrowserBase, WalletLoading } from "./browser/WalletBrowser";

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
  walletSelectionDisabled: boolean;
  showLogoutReason: boolean;
  redirectLocation: Location;
};

export const WalletSelector = compose<IStateProps & IDispatchProps & TAdditionalProps, {}>(
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
      walletSelectionDisabled: !userMayChooseWallet(userType),
      showLogoutReason: !!(location.state && location.state.logoutReason === ELogoutReason.SESSION_TIMEOUT),
      redirectLocation: createLocation(getRedirectionUrl(rootPath), location.state),
    }),
  ),
  // resetWalletOnLeave(),
  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(TransitionalLayout),
  ),
  branch<IStateProps>(({ isLoginRoute }) => isLoginRoute,
    renderComponent(WalletSelectorLoginLayout),
    renderComponent(WalletSelectorRegisterLayout)
  ),
)(shouldNeverHappen("WalletSelector reached default branch"));

export const WalletSelectorRegister = compose<IStateProps & IDispatchProps & TAdditionalProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<TWalletRegisterData, IDispatchProps>({
    stateToProps: s => ({
    ...selectRegisterWithBrowserWalletData(s),
    }),
  }),

  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(TransitionalLayout),
  ),
  withContainer(
    withProps(({rootPath,walletSelectionDisabled, ...rest})=> { console.log("withContainer",rootPath, rest);return ({rootPath,walletSelectionDisabled})}
    )(WalletBrowserBase)
  ),
  branch(({ browserWalletState }) => browserWalletState === EBrowserWalletState.BROWSER_WALLET_LOADING,
    renderComponent(WalletLoading)),
  branch(({ browserWalletState }) => browserWalletState === EBrowserWalletState.BROWSER_WALLET_ERROR,
    renderComponent(MetamaskError)),
)(LoadingIndicator);
