import { TMessage } from "../../components/translatedMessages/utils";
import { DeepReadonly } from "../../../../shared/dist/utils/types";
import { EWalletType } from "../web3/types";

export enum EBrowserWalletState {
  BROWSER_WALLET_ASK_FOR_EMAIL = "browserWalletAskForEmail",
  BROWSER_WALLET_LOADING = "browserWalletLoading",
  BROWSER_WALLET_SIGNING = "browserWalletSigning",
  BROWSER_WALLET_ERROR = "browserWalletError",
}

export enum ELightWalletState {
  LIGHT_WALLET_REGISTRATION_FORM = "lightWalletRegistrationForm",
  LIGHT_WALLET_LOADING = "lightWalletLoading",
  LIGHT_WALLET_SIGNING = "lightWalletSigning",
  LIGHT_WALLET_ERROR = "lightWalletError",
}

export enum ECommonWalletState {
  NOT_STARTED = "walletFlowNotStarted",
  REGISTRATION_FORM = "registrationForm",
  REGISTRATION_VERIFYING_EMAIL = "registrationVerifyingEmail",
  REGISTRATION_EMAIL_VERIFICATION_ERROR = "registrationEmailVerificationError",
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
  ({ walletState: EBrowserWalletState.BROWSER_WALLET_ERROR, errorMessage: TMessage } |
    { walletState: EBrowserWalletState.BROWSER_WALLET_LOADING } |
    { walletState: EBrowserWalletState.BROWSER_WALLET_SIGNING } |
    { walletState: ECommonWalletState.REGISTRATION_FORM } |
    { walletState: ECommonWalletState.REGISTRATION_VERIFYING_EMAIL } |
    { walletState: ECommonWalletState.REGISTRATION_EMAIL_VERIFICATION_ERROR, errorMessage: TMessage }
    )
  )

export type TLightWalletRegisterData = (
  TCommonWalletRegisterData &
  ({ walletState: ELightWalletState.LIGHT_WALLET_ERROR, errorMessage: TMessage } |
    { walletState: ELightWalletState.LIGHT_WALLET_LOADING } |
    { walletState: ELightWalletState.LIGHT_WALLET_SIGNING } |
    { walletState: ECommonWalletState.REGISTRATION_FORM } |
    { walletState: ECommonWalletState.REGISTRATION_VERIFYING_EMAIL } |
    { walletState: ECommonWalletState.REGISTRATION_EMAIL_VERIFICATION_ERROR, errorMessage: TMessage }
    )
  )

export type TInitialRegisterData = {
  walletState: ECommonWalletState.NOT_STARTED;
}

export type TWalletRegisterData =
  | TInitialRegisterData
  | TLightWalletRegisterData
  | TBrowserWalletRegisterData

export interface IWalletSelectorState {
  isMessageSigning: boolean;
  messageSigningError: DeepReadonly<TMessage> | undefined;
  isLoading: boolean;

  walletType: EWalletType
}
