import { withContainer } from "@neufund/shared";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { TMessage } from "../../../translatedMessages/utils";
import { selectWalletSelectorData } from "../../../../modules/wallet-selector/selectors";
import {
  TCommonWalletRegisterData,
  TLightWalletFormValues, TLightWalletRegisterData
} from "../../../../modules/wallet-selector/types";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { ECommonWalletRegistrationFlowState, TWalletRegisterData } from "../../../../modules/wallet-selector/types";
import { RegisterLightWalletBase } from "./RegisterLightWalletBase";
import { RegisterEnhancedLightWalletForm } from "./RegisterLightWalletForm";
import { shouldNeverHappen } from "../../../shared/NeverComponent";
import { WalletLoading } from "../../shared/WalletLoading";

export type TStateProps = {
  errorMessage: TMessage | undefined
  initialFormValues: TLightWalletFormValues
} & TCommonWalletRegisterData;

export type  TDispatchProps = {
  submitForm: (values: TLightWalletFormValues) => void;
}

export type TExternalProps = {
  seed: string
}

export const RestoreLightWallet = compose<TStateProps & TDispatchProps, TExternalProps>(
  appConnect<TWalletRegisterData, TDispatchProps>({
    stateToProps: state => {
      return ({
        ...selectWalletSelectorData(state),
      })
    },
    dispatchToProps: dispatch => ({
      submitForm: (values: TLightWalletFormValues) =>
        dispatch(actions.walletSelector.lightWalletRegisterFormData(values.email, values.password)),
    }),
  }),

  branch<TWalletRegisterData>(({ walletState }) => {
      console.log("no props:", walletState);
      return walletState === ECommonWalletRegistrationFlowState.NOT_STARTED
    },
    renderComponent(LoadingIndicator)),
  withContainer(RegisterLightWalletBase),
  branch<TLightWalletRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
    renderComponent(RegisterEnhancedLightWalletForm)),
  branch<TLightWalletRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL,
    renderComponent(WalletLoading)),
  branch<TLightWalletRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
    renderComponent(RegisterEnhancedLightWalletForm)),
  branch<TLightWalletRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING,
    renderComponent(WalletLoading)),
)(shouldNeverHappen("RestoreLightWallet reached default branch"));
