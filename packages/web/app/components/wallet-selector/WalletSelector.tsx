import { withContainer } from "@neufund/shared";
import { createLocation, Location } from "history";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { branch, compose, renderComponent, withProps } from "recompose";

import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectIsAuthorized } from "../../modules/auth/selectors";
import { ELogoutReason } from "../../modules/auth/types";
import { TLoginRouterState } from "../../modules/routing/types";
import {
  selectIsLoginRoute,
  selectIsMessageSigning,
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
import { WalletMessageSigner } from "./WalletMessageSigner";
import { getRedirectionUrl } from "./walletRouterHelpers";
import { WalletSelectorLayout } from "./WalletSelectorLayout";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

interface IStateProps {
  isAuthorized: boolean;
  rootPath: string;
  isLoginRoute: boolean;
  userType: EUserType;
}

interface IDispatchProps {
  openICBMModal: () => void;
}

type TAdditionalProps = {
  walletSelectionDisabled: boolean;
  logoutReason: ELogoutReason | undefined;
  redirectLocation: Location;
};

export const WalletSelector = compose<IStateProps & IDispatchProps & TAdditionalProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      isAuthorized: selectIsAuthorized(s),
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
      logoutReason: location.state && location.state.logoutReason,
      redirectLocation: createLocation(getRedirectionUrl(rootPath), location.state),
    }),
  ),
  resetWalletOnLeave(),
  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(TransitionalLayout),
  ),
  branch<IStateProps & IDispatchProps>(
    props => props.isMessageSigning,
    renderComponent(WalletMessageSigner),
  ),
)(WalletSelectorLayout);
