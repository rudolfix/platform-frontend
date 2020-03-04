import { branch, compose, renderComponent, withProps } from "recompose";
import { Location } from "history";

import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { appConnect } from "../../../../store";
import {
  EBrowserWalletRegistrationFlowState, ECommonWalletRegistrationFlowState,
  TBrowserWalletRegisterData, TCommonWalletRegisterData, TWalletRegisterData,
} from "../../../../modules/wallet-selector/types";
import { selectWalletSelectorData } from "../../../../modules/wallet-selector/selectors";
import { actions } from "../../../../modules/actions";
import { withContainer } from "../../../../../../shared/dist/utils/withContainer.unsafe";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { shouldNeverHappen } from "../../../shared/NeverComponent";
import { EUserType } from "../../../../lib/api/users/interfaces";
import { RegisterBrowserWalletBase, TWalletBrowserBaseProps } from "./RegisterBrowserWalletBase";
import { BrowserWalletAskForEmailAndTos } from "./RegisterBrowserWalletForm";
import { WalletLoading } from "../../shared/WalletLoading";
import { RegisterBrowserWalletError } from "./RegisterBrowserWalletError";
import { TContentExternalProps, TransitionalLayout } from "../../../layouts/Layout";
import { EContentWidth } from "../../../layouts/Content";

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
  branch<TWalletRegisterData>(({walletState}) => { console.log("no props:",walletState);return walletState === ECommonWalletRegistrationFlowState.NOT_STARTED},
    renderComponent(LoadingIndicator)),
  withContainer(
    withProps<TWalletBrowserBaseProps,TCommonWalletRegisterData>(({ rootPath, showWalletSelector }) => ({ rootPath, showWalletSelector })
    )(RegisterBrowserWalletBase)
  ),
  branch<TBrowserWalletRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
    renderComponent(BrowserWalletAskForEmailAndTos)),
  branch<TBrowserWalletRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL,
    renderComponent(WalletLoading)),
  branch<TBrowserWalletRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
    renderComponent(BrowserWalletAskForEmailAndTos)),
  branch<TBrowserWalletRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_LOADING,
    renderComponent(WalletLoading)),
  branch<TBrowserWalletRegisterData>(({ walletState }) => walletState === EBrowserWalletRegistrationFlowState.BROWSER_WALLET_ERROR,
    renderComponent(RegisterBrowserWalletError)),
)(shouldNeverHappen("WalletSelector reached default branch"));
