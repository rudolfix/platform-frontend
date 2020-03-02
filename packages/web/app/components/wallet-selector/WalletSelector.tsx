import { withContainer } from "@neufund/shared";
import { createLocation, Location } from "history";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { branch, compose, renderComponent, withProps } from "recompose";

import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { ELogoutReason } from "../../modules/auth/types";
import { TLoginRouterState } from "../../modules/routing/types";
import {
  selectIsLoginRoute, selectRegisterWalletType, selectRegisterWithBrowserWalletData,
  selectRootPath,
  selectUrlUserType,
} from "../../modules/wallet-selector/selectors";
import { appConnect } from "../../store";
import { EContentWidth } from "../layouts/Content";
import { TContentExternalProps, TransitionalLayout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { ICBMWalletHelpTextModal } from "./ICBMWalletHelpTextModal";
import { userMayChooseWallet } from "./utils";
import { getRedirectionUrl } from "./walletRouterHelpers";
import { WalletSelectorLoginLayout, WalletSelectorRegisterLayout } from "./WalletSelectorLayout";
import { shouldNeverHappen } from "../shared/NeverComponent";
import {
  EBrowserWalletState,
  TBrowserWalletRegisterData,
  TBrowserWalletRegisterReadyData
} from "../../modules/wallet-selector/reducer";
import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";
import {
  BrowserWalletAskForEmailAndTos, MetamaskError, TWalletBrowserBaseProps,
  WalletBrowserBase,
  WalletLoading
} from "./browser/WalletBrowser";
import { EWalletType } from "../../modules/web3/types";
import { RegisterLightWallet } from "./light/Register/RegisterLightWallet";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

interface IStateProps {
  rootPath: string;
  isLoginRoute: boolean;
  userType: EUserType;
}

interface IDispatchProps {
  submitForm: (email:string)=> void;
  openICBMModal: () => void;
}

type TAdditionalProps = {
  showWalletSelector: boolean;
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
      showWalletSelector: !userMayChooseWallet(userType),
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


export const BrowserWalletRegister = compose<IStateProps & IDispatchProps & TAdditionalProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<TBrowserWalletRegisterData, IDispatchProps>({
    stateToProps: s => ({
      ...selectRegisterWithBrowserWalletData(s),
    }),
    dispatchToProps: dispatch => ({
      submitForm: (email: string) => dispatch(actions.walletSelector.browserWalletRegisterEmailAndTos(email)),
    }),
  }),

  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(TransitionalLayout),
  ),
  branch<TBrowserWalletRegisterData>(({browserWalletState}) => { console.log("no props:",browserWalletState);return browserWalletState === EBrowserWalletState.NOT_STARTED},
    renderComponent(LoadingIndicator)),
  withContainer(
    withProps<TWalletBrowserBaseProps,TBrowserWalletRegisterReadyData>(({ rootPath, showWalletSelector }) => ({ rootPath, showWalletSelector })
    )(WalletBrowserBase)
  ),
  branch<TBrowserWalletRegisterData>(({ browserWalletState }) => browserWalletState === EBrowserWalletState.BROWSER_WALLET_ASK_FOR_EMAIL,
    renderComponent(BrowserWalletAskForEmailAndTos)),
  branch<TBrowserWalletRegisterData>(({ browserWalletState }) => browserWalletState === EBrowserWalletState.BROWSER_WALLET_VERIFYING_EMAIL,
    renderComponent(WalletLoading)),
  branch<TBrowserWalletRegisterData>(({ browserWalletState }) => browserWalletState === EBrowserWalletState.BROWSER_WALLET_EMAIL_VERIFICATION_ERROR,
    renderComponent(BrowserWalletAskForEmailAndTos)),
  branch<TBrowserWalletRegisterData>(({ browserWalletState }) => browserWalletState === EBrowserWalletState.BROWSER_WALLET_LOADING,
    renderComponent(WalletLoading)),
  branch<TBrowserWalletRegisterData>(({ browserWalletState }) => browserWalletState === EBrowserWalletState.BROWSER_WALLET_ERROR,
    renderComponent(MetamaskError)),
)(shouldNeverHappen("WalletSelector reached default branch"));

export const WalletSelectorRegister = compose<IStateProps & IDispatchProps & TAdditionalProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<TBrowserWalletRegisterData, IDispatchProps>({
    stateToProps: s => ({
      walletType:selectRegisterWalletType(s)
    }),
  }),

  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(TransitionalLayout),
  ),
  branch(({walletType}) => walletType === EWalletType.LIGHT,
    renderComponent(RegisterLightWallet)),
  branch(({walletType}) => walletType === EWalletType.BROWSER,
    renderComponent(BrowserWalletRegister))
)(shouldNeverHappen("WalletSelector reached default branch"));
