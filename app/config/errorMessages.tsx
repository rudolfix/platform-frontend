import * as React from 'react';
import { FormattedMessage,FormattedHTMLMessage } from "react-intl-phraseapp";

import {externalRoutes} from "../components/externalRoutes";
import {TTranslatedString} from "../types";

export interface ErrorWithData {
  errorType: ErrorMessage,
  errorData?: Object
}

interface ITranslationValues {
  [SignInUserErrorMessages:string] : string
}

export type ErrorMessage =
  GenericError
  | SignInUserErrorMessage
  | BrowserWalletErrorMessage
  | LedgerErrorMessage
  | LightWalletErrorMessage
  | SignerErrorMessage
  | MismatchedWalletAddressErrorMessage

export enum SignInUserErrorMessage {
  MESSAGE_SIGNING_REJECTED = "messageSigningRejected",
  MESSAGE_SIGNING_TIMEOUT = "messageSigningTimeout",
  MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE = "serverConnectionFailure"
}

export enum GenericError {
  GENERIC_ERROR = "genericError"
}

export enum BrowserWalletErrorMessage {
  BROWSER_WALLET_IS_LOCKED = "walletIsLocked",
  BROWSER_WALLET_CONNECTED_TO_WRONG_NETWORK = "browserWalletConnectedToWrongNetwork",
  BROWSER_WALLET_NOT_ENABLED = "browserWalletNotEnabled",
  BROWSER_WALLET_ACCOUNT_APPROVAL_REJECTED = "browserWalletAccountApprovalRejected",
  BROWSER_WALLET_ACCOUNT_APPROVAL_PENDING = "browserWalletAccountApprovalPending",
  BROWSER_WALLET_GENERIC_ERROR = "browserWalletGenericError"
}

export enum LedgerErrorMessage {
  LEDGER_LOCKED = "ledgerLocked",
  LEDGER_GENERIC_ERROR = "ledgerGenericError"
}

export enum LightWalletErrorMessage {
  LIGHT_WALLET_WRONG_PASSWORD_SALT = "lightWalletWrongPasswordSalt",
  LIGHT_WALLET_SIGN_MESSAGE = "lightWalletSignMessage",
  LIGHT_WALLET_CREATION_ERROR = "lightWalletCreationError",
  LIGHT_WALLET_DESERIALIZE ="lightWalletDeserialize",
  LIGHT_WALLET_ENCRYPTION_ERROR = "lightWalletEncryptionError",
  LIGHT_WALLET_WRONG_PASSWORD = "lightWalletWrongPassword",
  LIGHT_WALLET_WRONG_MNEMONIC = "lightWalletWrongMnemonic",
  LIGHT_WALLET_GENERIC_ERROR = "lightWalletGenericError",
}

export enum SignerErrorMessage {
  SIGNER_REJECTED_CONFIRMATION = "signerRejectedConfirmation",
  SIGNER_TIMEOUT = "signerTimeout",
  SIGNER_GENERIC_ERROR = "signerGenericError"
}

export enum MismatchedWalletAddressErrorMessage {
  MISMATCHED_WALLET_ADDRESS = "mismatchedWalletAddress"
}

export const MapEnumToTranslation = ({errorType, errorData}: ErrorWithData): TTranslatedString => {
  switch (errorType) {
    case GenericError.GENERIC_ERROR:
      return ""; //TODO
    case SignInUserErrorMessage.MESSAGE_SIGNING_REJECTED:
      return <FormattedMessage id="modules.auth.sagas.sign-in-user.message-signing-was-rejected"/>;
    case SignInUserErrorMessage.MESSAGE_SIGNING_TIMEOUT:
      return <FormattedMessage id="modules.auth.sagas.sign-in-user.message-signing-timeout"/>;
    case SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE:
      return <FormattedHTMLMessage
        tagName="span"
        id="modules.auth.sagas.sign-in-user.error-our-servers-are-having-problems"
        values={{url: `${externalRoutes.neufundSupport}/home`}}
      />;
    case BrowserWalletErrorMessage.BROWSER_WALLET_IS_LOCKED:
      return "Your wallet seems to be locked — we can't access any accounts";
    case BrowserWalletErrorMessage.BROWSER_WALLET_CONNECTED_TO_WRONG_NETWORK:
      return "Please connect your wallet to the \"Main Ethereum Network\" by selecting from the \"Networks\" drop-down menu in MetaMask.";
    case BrowserWalletErrorMessage.BROWSER_WALLET_NOT_ENABLED:
      return "Please check if the MetaMask extension is enabled in your browser. We were unable to detect any wallet.";
    case BrowserWalletErrorMessage.BROWSER_WALLET_ACCOUNT_APPROVAL_REJECTED:
      return "Data approval rejected.";
    case BrowserWalletErrorMessage.BROWSER_WALLET_ACCOUNT_APPROVAL_PENDING:
      return "Please check MetaMask to confirm this action.";
    case BrowserWalletErrorMessage.BROWSER_WALLET_GENERIC_ERROR:
      return "browserWalletUnknownError";

      case LedgerErrorMessage.LEDGER_LOCKED:
      return "Please unlock your Ledger Nano S by entering your PIN code on the device.";
    case LedgerErrorMessage.LEDGER_GENERIC_ERROR:
      return "Ledger Nano S is not available";

    case LightWalletErrorMessage.LIGHT_WALLET_WRONG_PASSWORD_SALT:
      return "Password is not correct";
    case LightWalletErrorMessage.LIGHT_WALLET_SIGN_MESSAGE:
      return "Cannot sign personal message";
    case LightWalletErrorMessage.LIGHT_WALLET_CREATION_ERROR:
      return "Cannot create new Light Wallet";
    case LightWalletErrorMessage.LIGHT_WALLET_DESERIALIZE:
      return "There was a problem with Vault retrieval";
    case LightWalletErrorMessage.LIGHT_WALLET_ENCRYPTION_ERROR:
      return "There was a problem with Light Wallet encryption";
    case LightWalletErrorMessage.LIGHT_WALLET_WRONG_PASSWORD:
      return "The password you entered is incorrect. Please try again.";
    case LightWalletErrorMessage.LIGHT_WALLET_WRONG_MNEMONIC:
      return "Something went wrong. Please enter your 24 word recovery and try again.";
    case LightWalletErrorMessage.LIGHT_WALLET_GENERIC_ERROR:
      return "Light Wallet is unavailable";

    case SignerErrorMessage.SIGNER_REJECTED_CONFIRMATION:
      return "Message signing was rejected";
    case SignerErrorMessage.SIGNER_TIMEOUT:
      return "Oops! Looks like the request timed out. Please try again.";
    case SignerErrorMessage.SIGNER_GENERIC_ERROR:
      return ""; //TODO
    case MismatchedWalletAddressErrorMessage.MISMATCHED_WALLET_ADDRESS:
      return <FormattedMessage id="error.message.mismatched-wallet-address" values={errorData as ITranslationValues}/>
  }
};
