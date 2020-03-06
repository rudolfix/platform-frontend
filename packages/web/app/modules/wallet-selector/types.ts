import { DeepReadonly } from "../../../../shared/dist/utils/types";
import { TMessage } from "../../components/translatedMessages/utils";
import { EWalletType } from "../web3/types";

export enum EFlowType {
  REGISTER = "register",
  RESTORE_WALLET = "restoreWallet",
  IMPORT_WALLET = "importWallet",
  LOGIN = "login", //not used yet
}

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
  RECOVERY_FORM = "recoverForm",
  REGISTRATION_VERIFYING_EMAIL = "registrationVerifyingEmail",
  REGISTRATION_EMAIL_VERIFICATION_ERROR = "registrationEmailVerificationError",
  RECOVERY_EMAIL_VERIFICATION_ERROR = "recoveryEmailVerificationError",
  REGISTRATION_WALLET_LOADING = "REGISTRATION_WALLET_LOADING",
  REGISTRATION_WALLET_SIGNING = "REGISTRATION_WALLET_SIGNING",
}

export type TBrowserWalletFormValues = {
  tos: boolean;
  email: string;
};

export type TLightWalletFormValues = {
  tos: boolean;
  email: string;
  password: string;
  repeatPassword: string;
};

export type TCommonWalletRegisterData = {
  showWalletSelector: boolean;
  rootPath: string;
  initialFormValues: TBrowserWalletFormValues | TLightWalletFormValues;
};

export type TBrowserWalletRegisterData = TCommonWalletRegisterData &
  (
    | { uiState: EBrowserWalletRegistrationFlowState.BROWSER_WALLET_ERROR; errorMessage: TMessage }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_LOADING }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL }
    | {
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR;
        errorMessage: TMessage;
      }
  );

export type TLightWalletRegisterData = TCommonWalletRegisterData &
  (
    | { uiState: ELightWalletRegistrationFlowState.LIGHT_WALLET_ERROR; errorMessage: TMessage }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_LOADING }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM }
    | { uiState: ECommonWalletRegistrationFlowState.RECOVERY_FORM }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL }
    | {
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR;
        errorMessage: TMessage;
      }
    | {
        uiState: ECommonWalletRegistrationFlowState.RECOVERY_EMAIL_VERIFICATION_ERROR;
        errorMessage: TMessage;
      }
  );

export type TLedgerRegisterData = TCommonWalletRegisterData &
  (
    | { uiState: ELedgerRegistrationFlowState.LEDGER_NOT_SUPPORTED }
    | { uiState: ELedgerRegistrationFlowState.LEDGER_INIT }
    | { uiState: ELedgerRegistrationFlowState.LEDGER_INIT_ERROR; errorMessage: TMessage }
    | { uiState: ELedgerRegistrationFlowState.LEDGER_ACCOUNT_CHOOSER }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_LOADING }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM }
    | { uiState: ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL }
    | {
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR;
        errorMessage: TMessage;
      }
  );

export type TInitialRegisterData = {
  uiState: ECommonWalletRegistrationFlowState.NOT_STARTED;
};

export type TWalletRegisterData =
  | TInitialRegisterData
  | TLightWalletRegisterData
  | TBrowserWalletRegisterData
  | TLedgerRegisterData;

export type TWalletSelectorState = {
  walletType: EWalletType;
  flowType: EFlowType;

  //backwards compatibility only
  isMessageSigning: boolean;
  messageSigningError: DeepReadonly<TMessage> | undefined;
  isLoading: boolean;
};
