import * as React from "react";
import { branch, compose, nest, renderComponent, withProps } from "recompose";
import { WalletLedgerNotSupported } from "../WalletLedgerNotSupportedComponent";
import { WalletLedgerChooser } from "../WalletLedgerChooser";
import { LedgerError, WalletLedgerInit } from "../WalletLedgerInitComponent";
import { appConnect } from "../../../../store";
import { isSupportingLedger } from "../../../../modules/user-agent/reducer";
import { selectWalletSelectorData } from "../../../../modules/wallet-selector/selectors";
import {
  ECommonWalletRegistrationFlowState, ELedgerRegistrationFlowState, TBrowserWalletRegisterData,
  TCommonWalletRegisterData, TLedgerRegisterData,
  TWalletRegisterData
} from "../../../../modules/wallet-selector/types";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { withContainer } from "../../../../../../shared/dist/utils/withContainer.unsafe";
import { RegisterBrowserWalletBase, TWalletBrowserBaseProps } from "../../browser/Register/RegisterBrowserWalletBase";
import { BrowserWalletAskForEmailAndTos } from "../../browser/Register/RegisterBrowserWalletForm";
import { RegisterLedgerBase } from "./RegisterLedgerBase";
import { shouldNeverHappen } from "../../../shared/NeverComponent";
import { actions } from "../../../../modules/actions";

import { WalletLoading } from "../../shared/WalletLoading";
import { TContentExternalProps, TransitionalLayout } from "../../../layouts/Layout";
import { EContentWidth } from "../../../layouts/Content";
import { FullscreenProgressLayout } from "../../../layouts/FullscreenProgressLayout";


interface IWalletLedgerStateProps {
  isConnectionEstablished: boolean;
  isLedgerSupported: boolean;
}

export const WalletLedgerComponent: React.FunctionComponent<IWalletLedgerStateProps> = ({
  isConnectionEstablished,
  isLedgerSupported,
}) => {
  if (!isLedgerSupported) {
    return <WalletLedgerNotSupported />;
  } else if (isConnectionEstablished) {
    return <WalletLedgerChooser />;
  } else {
    return <WalletLedgerInit />;
  }
};

export const RegisterLedger = compose<IWalletLedgerStateProps, {}>(
  appConnect<IWalletLedgerStateProps>({
    stateToProps: state => ({
      ...selectWalletSelectorData(state),
    }),
    dispatchToProps: dispatch => ({
      submitForm: (email: string) => dispatch(actions.walletSelector.browserWalletRegisterFormData(email)),
      closeAccountChooser: () => dispatch(actions.walletSelector.ledgerCloseAccountChooser())
    }),
  }),

  branch<TLedgerRegisterData>(({ walletState }) => walletState === ELedgerRegistrationFlowState.LEDGER_ACCOUNT_CHOOSER,
    renderComponent(
      nest(
        withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(FullscreenProgressLayout),
        WalletLedgerChooser
      )
    )),

  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(TransitionalLayout),
  ),
  branch<TWalletRegisterData>(({ walletState }) => {
      console.log("no props:", walletState);
      return walletState === ECommonWalletRegistrationFlowState.NOT_STARTED
    },
    renderComponent(LoadingIndicator)),
  withContainer(
    withProps<TWalletBrowserBaseProps, TCommonWalletRegisterData>(({ rootPath, showWalletSelector }) => ({
        rootPath,
        showWalletSelector
      })
    )(RegisterLedgerBase)
  ),
  branch<TLedgerRegisterData>(({ walletState }) => walletState === ELedgerRegistrationFlowState.LEDGER_NOT_SUPPORTED,
    renderComponent(WalletLedgerNotSupported)), //fixme move to shared
  branch<TLedgerRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
    renderComponent(BrowserWalletAskForEmailAndTos)), //fixme move to shared
  branch<TLedgerRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL,
    renderComponent(WalletLoading)), //fixme move to shared
  branch<TBrowserWalletRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
    renderComponent(BrowserWalletAskForEmailAndTos)),
  branch<TLedgerRegisterData>(({ walletState }) => walletState === ELedgerRegistrationFlowState.LEDGER_INIT,
    renderComponent(WalletLoading)), //fixme move to shared
  branch<TLedgerRegisterData>(({ walletState }) => walletState === ELedgerRegistrationFlowState.LEDGER_INIT_ERROR,
    renderComponent(LedgerError)), //fixme move to shared

  //fixme unsupported version!!!!
)(shouldNeverHappen("RegisterLedger reached default branch"));
