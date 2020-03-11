import { withContainer } from "@neufund/shared";
import { branch, compose, renderComponent, withProps } from "recompose";

import { actions } from "../../../../../modules/actions";
import { selectWalletSelectorData } from "../../../../../modules/wallet-selector/selectors";
import {
  ECommonWalletRegistrationFlowState,
  EFlowType,
  TCommonWalletRegisterData,
  TLightWalletFormValues,
  TLightWalletRegisterData,
  TWalletRegisterData,
  TWalletSelectorState,
} from "../../../../../modules/wallet-selector/types";
import { appConnect } from "../../../../../store";
import { LoadingIndicator } from "../../../../shared/loading-indicator/LoadingIndicator";
import { shouldNeverHappen } from "../../../../shared/NeverComponent";
import { TMessage } from "../../../../translatedMessages/utils";
import { WalletLoading } from "../../../shared/WalletLoading";
import { RegisterEnhancedLightWalletForm } from "../../../WalletSelectorRegister/RegisterLightWallet/RegisterLightWalletForm";
import { ImportLightWalletBase } from "./ImportLightWalletBase";
import { RecoverLightWalletBase } from "./RecoverLightWalletBase";

export type TStateProps = {
  errorMessage: TMessage | undefined;
  initialFormValues: TLightWalletFormValues;
} & TCommonWalletRegisterData;

export type TDispatchProps = {
  submitForm: (values: TLightWalletFormValues) => void;
};

export type TExternalProps = {
  seed: string;
};

export const RestoreLightWallet = compose<TStateProps & TDispatchProps, TExternalProps>(
  appConnect<TWalletRegisterData, TDispatchProps>({
    stateToProps: state => ({
      ...selectWalletSelectorData(state),
    }),
    dispatchToProps: dispatch => ({
      submitForm: (values: TLightWalletFormValues) =>
        dispatch(
          actions.walletSelector.lightWalletRegisterFormData(
            values.email,
            values.password,
            values.tos,
          ),
        ),
    }),
  }),
  withProps({ restore: true }),
  branch<TWalletRegisterData>(
    ({ uiState }) => uiState === ECommonWalletRegistrationFlowState.NOT_STARTED,
    renderComponent(LoadingIndicator),
  ),
  withContainer<TWalletSelectorState>(
    compose<TWalletSelectorState, TWalletSelectorState>(
      branch<TWalletSelectorState>(
        ({ flowType }) => flowType === EFlowType.RESTORE_WALLET,
        renderComponent(RecoverLightWalletBase),
      ),
      branch<TWalletSelectorState>(
        ({ flowType }) => flowType === EFlowType.IMPORT_WALLET,
        renderComponent(ImportLightWalletBase),
      ),
    )(shouldNeverHappen("unexpected flow type")),
  ),
  branch<TLightWalletRegisterData>(
    ({ uiState }) => uiState === ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
    renderComponent(RegisterEnhancedLightWalletForm),
  ),
  branch<TLightWalletRegisterData>(
    ({ uiState }) => uiState === ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL,
    renderComponent(WalletLoading),
  ),
  branch<TLightWalletRegisterData>(
    ({ uiState }) =>
      uiState === ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
    renderComponent(RegisterEnhancedLightWalletForm),
  ),
  branch<TLightWalletRegisterData>(
    ({ uiState }) => uiState === ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING,
    renderComponent(WalletLoading),
  ),
)(shouldNeverHappen("RestoreLightWallet reached default branch"));
