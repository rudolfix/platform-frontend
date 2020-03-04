import { withContainer } from "@neufund/shared";
import { branch, compose, renderComponent, withProps } from "recompose";

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
import { TContentExternalProps, TransitionalLayout } from "../../../layouts/Layout";
import { EContentWidth } from "../../../layouts/Content";

export type TStateProps = {
  errorMessage: TMessage | undefined
  initialFormValues: TLightWalletFormValues
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
        ...selectWalletSelectorData(state),
      })
    },
    dispatchToProps: dispatch => ({
      submitForm: (values: TLightWalletFormValues) =>
        dispatch(actions.walletSelector.lightWalletRegisterFormData(values.email, values.password)),
    }),
  }),
  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(TransitionalLayout),
  ),
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
)(shouldNeverHappen("RegisterLightWallet reached default branch"));
