import { branch, compose, nest, renderComponent, withProps } from "recompose";
import { WalletLedgerNotSupported } from "../WalletLedgerNotSupportedComponent";
import { WalletLedgerChooser } from "../WalletLedgerChooser";
import { LedgerError } from "../WalletLedgerInitComponent";
import { appConnect } from "../../../../store";
import { selectWalletSelectorData } from "../../../../modules/wallet-selector/selectors";
import {
  ECommonWalletRegistrationFlowState, ELedgerRegistrationFlowState, TBrowserWalletRegisterData,
  TCommonWalletRegisterData, TLedgerRegisterData,
  TWalletRegisterData
} from "../../../../modules/wallet-selector/types";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { withContainer } from "../../../../../../shared/dist/utils/withContainer.unsafe";
import {  TWalletBrowserBaseProps } from "../../browser/Register/RegisterBrowserWalletBase";
import { BrowserWalletAskForEmailAndTos } from "../../browser/Register/RegisterBrowserWalletForm";
import { RegisterLedgerBase } from "./RegisterLedgerBase";
import { shouldNeverHappen } from "../../../shared/NeverComponent";
import { actions } from "../../../../modules/actions";

import { WalletLoading } from "../../shared/WalletLoading";
import { TContentExternalProps, TransitionalLayout } from "../../../layouts/Layout";
import { EContentWidth } from "../../../layouts/Content";
import { FullscreenProgressLayout } from "../../../layouts/FullscreenProgressLayout";


export const RegisterLedger = compose<TWalletRegisterData, {}>(
  appConnect<TWalletRegisterData>({
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
    renderComponent(WalletLedgerNotSupported)),
  branch<TLedgerRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
    renderComponent(BrowserWalletAskForEmailAndTos)),
  branch<TLedgerRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL,
    renderComponent(WalletLoading)),
  branch<TBrowserWalletRegisterData>(({ walletState }) => walletState === ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
    renderComponent(BrowserWalletAskForEmailAndTos)),
  branch<TLedgerRegisterData>(({ walletState }) => walletState === ELedgerRegistrationFlowState.LEDGER_INIT,
    renderComponent(WalletLoading)),
  branch<TLedgerRegisterData>(({ walletState }) => walletState === ELedgerRegistrationFlowState.LEDGER_INIT_ERROR,
    renderComponent(LedgerError)),
)(shouldNeverHappen("RegisterLedger reached default branch"));
