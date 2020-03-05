import { branch, compose, nest, renderComponent, withProps } from "recompose";

import { withContainer } from "../../../../../../shared/dist/utils/withContainer.unsafe";
import { actions } from "../../../../modules/actions";
import { selectWalletSelectorData } from "../../../../modules/wallet-selector/selectors";
import {
  ECommonWalletRegistrationFlowState, ELedgerRegistrationFlowState, TBrowserWalletRegisterData,
  TCommonWalletRegisterData, TLedgerRegisterData,
  TWalletRegisterData
} from "../../../../modules/wallet-selector/types";
import { appConnect } from "../../../../store";
import { EContentWidth } from "../../../layouts/Content";
import { FullscreenProgressLayout } from "../../../layouts/FullscreenProgressLayout";
import { TContentExternalProps, TransitionalLayout } from "../../../layouts/Layout";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { shouldNeverHappen } from "../../../shared/NeverComponent";
import {  TWalletBrowserBaseProps } from "../../browser/Register/BrowserWalletBase";
import { BrowserWalletAskForEmailAndTos } from "../../browser/Register/RegisterBrowserWalletForm";
import { WalletLoading } from "../../shared/WalletLoading";
import { WalletLedgerChooser } from "../WalletLedgerChooser";
import { LedgerError } from "../WalletLedgerInitComponent";
import { WalletLedgerNotSupported } from "../WalletLedgerNotSupportedComponent";
import { RegisterLedgerBase } from "./RegisterLedgerBase";


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

  branch<TLedgerRegisterData>(({ uiState }) => uiState === ELedgerRegistrationFlowState.LEDGER_ACCOUNT_CHOOSER,
    renderComponent(
      nest(
        withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(FullscreenProgressLayout),
        WalletLedgerChooser
      )
    )),

  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(TransitionalLayout),
  ),
  branch<TWalletRegisterData>(({ uiState }) => uiState === ECommonWalletRegistrationFlowState.NOT_STARTED,
    renderComponent(LoadingIndicator)),
  withContainer(
    withProps<TWalletBrowserBaseProps, TCommonWalletRegisterData>(({ rootPath, showWalletSelector }) => ({
        rootPath,
        showWalletSelector
      })
    )(RegisterLedgerBase)
  ),
  branch<TLedgerRegisterData>(({ uiState }) => uiState === ELedgerRegistrationFlowState.LEDGER_NOT_SUPPORTED,
    renderComponent(WalletLedgerNotSupported)),
  branch<TLedgerRegisterData>(({ uiState }) => uiState === ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
    renderComponent(BrowserWalletAskForEmailAndTos)),
  branch<TLedgerRegisterData>(({ uiState }) => uiState === ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL,
    renderComponent(WalletLoading)),
  branch<TBrowserWalletRegisterData>(({ uiState }) => uiState === ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
    renderComponent(BrowserWalletAskForEmailAndTos)),
  branch<TLedgerRegisterData>(({ uiState }) => uiState === ELedgerRegistrationFlowState.LEDGER_INIT,
    renderComponent(WalletLoading)),
  branch<TLedgerRegisterData>(({ uiState }) => uiState === ELedgerRegistrationFlowState.LEDGER_INIT_ERROR,
    renderComponent(LedgerError)),
)(shouldNeverHappen("RegisterLedger reached default branch"));
