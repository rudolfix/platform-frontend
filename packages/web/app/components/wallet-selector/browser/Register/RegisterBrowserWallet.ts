import { Location } from "history";
import { branch, compose, renderComponent, withProps } from "recompose";

import { withContainer } from "../../../../../../shared/dist/utils/withContainer.unsafe";
import { EUserType } from "../../../../lib/api/users/interfaces";
import { actions } from "../../../../modules/actions";
import { selectWalletSelectorData } from "../../../../modules/wallet-selector/selectors";
import {
  EBrowserWalletRegistrationFlowState, ECommonWalletRegistrationFlowState,
  TBrowserWalletRegisterData, TCommonWalletRegisterData, TWalletRegisterData,
} from "../../../../modules/wallet-selector/types";
import { appConnect } from "../../../../store";
import { EContentWidth } from "../../../layouts/Content";
import { TContentExternalProps, TransitionalLayout } from "../../../layouts/Layout";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { shouldNeverHappen } from "../../../shared/NeverComponent";
import { WalletLoading } from "../../shared/WalletLoading";
import { BrowserWalletBase, TWalletBrowserBaseProps } from "./BrowserWalletBase";
import { RegisterBrowserWalletError } from "./RegisterBrowserWalletError";
import { BrowserWalletAskForEmailAndTos } from "./RegisterBrowserWalletForm";

interface IStateProps {
  rootPath: string;
  isLoginRoute: boolean;
  userType: EUserType;
}

interface IDispatchProps {
  submitForm: (email:string)=> void;
}

type TAdditionalProps = {
  showWalletSelector: boolean;
  showLogoutReason: boolean;
  redirectLocation: Location;
};

export const RegisterBrowserWallet = compose<IStateProps & IDispatchProps & TAdditionalProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<TWalletRegisterData, IDispatchProps>({
    stateToProps: s => ({
      ...selectWalletSelectorData(s),
    }),
    dispatchToProps: dispatch => ({
      submitForm: (email: string) => dispatch(actions.walletSelector.browserWalletRegisterFormData(email)),
    }),
  }),
  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(TransitionalLayout),
  ),
  branch<TWalletRegisterData>(({uiState}) => uiState === ECommonWalletRegistrationFlowState.NOT_STARTED,
    renderComponent(LoadingIndicator)),
  withContainer(
    withProps<TWalletBrowserBaseProps,TCommonWalletRegisterData>(({ rootPath, showWalletSelector }) => ({ rootPath, showWalletSelector })
    )(BrowserWalletBase)
  ),
  branch<TBrowserWalletRegisterData>(({ uiState }) => uiState === ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
    renderComponent(BrowserWalletAskForEmailAndTos)),
  branch<TBrowserWalletRegisterData>(({ uiState }) => uiState === ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL,
    renderComponent(WalletLoading)),
  branch<TBrowserWalletRegisterData>(({ uiState }) => uiState === ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
    renderComponent(BrowserWalletAskForEmailAndTos)),
  branch<TBrowserWalletRegisterData>(({ uiState }) => uiState === ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_LOADING,
    renderComponent(WalletLoading)),
  branch<TBrowserWalletRegisterData>(({ uiState }) => uiState === EBrowserWalletRegistrationFlowState.BROWSER_WALLET_ERROR,
    renderComponent(RegisterBrowserWalletError)),
)(shouldNeverHappen("WalletSelectorLogin reached default branch"));
