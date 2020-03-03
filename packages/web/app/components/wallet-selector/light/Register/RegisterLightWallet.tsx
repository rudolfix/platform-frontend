import { withContainer } from "@neufund/shared";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { TMessage } from "../../../translatedMessages/utils";
import { selectRegisterWithBrowserWalletData } from "../../../../modules/wallet-selector/selectors";
import {
  ELightWalletState,
  TCommonWalletRegisterData,
  TLightWalletFormValues, TLightWalletRegisterData
} from "../../../../modules/wallet-selector/types";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { ECommonWalletState, TWalletRegisterData } from "../../../../modules/wallet-selector/types";
import { RegisterLightWalletBase } from "./RegisterLightWalletBase";
import { RegisterEnhancedLightWalletForm } from "./RegisterLightWalletForm";
import { shouldNeverHappen } from "../../../shared/NeverComponent";
import { WalletLoading } from "../../shared/WalletLoading";

export type TStateProps = {
  errorMessage: TMessage | undefined
  defaultFormValues: TLightWalletFormValues
} & TCommonWalletRegisterData;

export type TRegisterWalletExternalProps = { restore?: boolean };

export type  TDispatchProps = {
  submitForm: (values: TLightWalletFormValues) => void;
}

export const RegisterLightWallet = compose<TStateProps & TDispatchProps,
  TRegisterWalletExternalProps>(
  appConnect<TWalletRegisterData, TDispatchProps>({
    stateToProps: state => {
      return ({
        ...selectRegisterWithBrowserWalletData(state),
      })
    },
    dispatchToProps: dispatch => ({
      submitForm: (values: TLightWalletFormValues) =>
        dispatch(actions.walletSelector.lightWalletRegister(values.email, values.password)),
    }),
  }),
  branch<TWalletRegisterData>(({ walletState }) => {
      console.log("no props:", walletState);
      return walletState === ECommonWalletState.NOT_STARTED
    },
    renderComponent(LoadingIndicator)),
  withContainer(RegisterLightWalletBase),
  branch<TLightWalletRegisterData>(({ walletState }) => walletState === ELightWalletState.LIGHT_WALLET_REGISTRATION_FORM,
    renderComponent(RegisterEnhancedLightWalletForm)),
  branch<TLightWalletRegisterData>(({ walletState }) => walletState === ELightWalletState.LIGHT_WALLET_VERIFYING_EMAIL,
    renderComponent(WalletLoading)),
  branch<TLightWalletRegisterData>(({ walletState }) => walletState === ELightWalletState.LIGHT_WALLET_EMAIL_VERIFICATION_ERROR,
    renderComponent(RegisterEnhancedLightWalletForm)),
  branch<TLightWalletRegisterData>(({ walletState }) => walletState === ELightWalletState.LIGHT_WALLET_SIGNING,
    renderComponent(WalletLoading)),
)(shouldNeverHappen("RegisterLightWallet reached default branch"));
