import { TMessage } from "../../components/translatedMessages/utils";
import { DeepReadonly } from "../../../../shared/dist/utils/types";
import { EWalletType } from "../web3/types";

export enum EBrowserWalletRegistrationFlowState {
  BROWSER_WALLET_LOADING = "browserWalletLoading",
  BROWSER_WALLET_ERROR = "browserWalletError",
}

export enum ELightWalletRegistrationFlowState {
  LIGHT_WALLET_SIGNING = "lightWalletSigning",
  LIGHT_WALLET_ERROR = "lightWalletError",
}

export enum ELedgerRegistrationFlowState {
  LEDGER_NOT_SUPPORTED = "ledgerNotSupported",
  LEDGER_INIT = "ledgerInit",
  LEDGER_INIT_ERROR = "ledgerInitError",
  LEDGER_ACCOUNT_CHOOSER = "ledgerAccountChooser",
}

export enum ECommonWalletRegistrationFlowState {
  NOT_STARTED = "walletFlowNotStarted",
  REGISTRATION_FORM = "registrationForm",
  REGISTRATION_VERIFYING_EMAIL = "registrationVerifyingEmail",
  REGISTRATION_EMAIL_VERIFICATION_ERROR = "registrationEmailVerificationError",
  REGISTRATION_WALLET_LOADING = "REGISTRATION_WALLET_LOADING",
  REGISTRATION_WALLET_SIGNING = "REGISTRATION_WALLET_SIGNING"
}

export type TBrowserWalletFormValues = {
  tos: boolean;
  email: string;
}

export type TLightWalletFormValues = {
  tos: boolean;
  email: string;
  password: string;
  repeatPassword: string
}

export type TCommonWalletRegisterData = {
  showWalletSelector: boolean;
  rootPath: string;
  initialFormValues: TBrowserWalletFormValues | TLightWalletFormValues
}

export type TBrowserWalletRegisterData = (
  TCommonWalletRegisterData &
  ({ walletState: EBrowserWalletRegistrationFlowState.BROWSER_WALLET_ERROR, errorMessage: TMessage } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_LOADING } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR, errorMessage: TMessage }
    )
  )

export type TLightWalletRegisterData = (
  TCommonWalletRegisterData &
  ({ walletState: ELightWalletRegistrationFlowState.LIGHT_WALLET_ERROR, errorMessage: TMessage } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_LOADING } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR, errorMessage: TMessage }
    )
  )

export type TLedgerRegisterData = (
  TCommonWalletRegisterData &
  ({ walletState: ELedgerRegistrationFlowState.LEDGER_NOT_SUPPORTED } |
    { walletState: ELedgerRegistrationFlowState.LEDGER_INIT } |
    { walletState: ELedgerRegistrationFlowState.LEDGER_INIT_ERROR, errorMessage: TMessage } |
    { walletState: ELedgerRegistrationFlowState.LEDGER_ACCOUNT_CHOOSER } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_LOADING } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL } |
    { walletState: ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR, errorMessage: TMessage }
    )
  )

export type TInitialRegisterData = {
  walletState: ECommonWalletRegistrationFlowState.NOT_STARTED;
}

export type TWalletRegisterData =
  | TInitialRegisterData
  | TLightWalletRegisterData
  | TBrowserWalletRegisterData
  | TLedgerRegisterData

export interface IWalletSelectorState {
  isMessageSigning: boolean;
  messageSigningError: DeepReadonly<TMessage> | undefined;
  isLoading: boolean;

  walletType: EWalletType
}
