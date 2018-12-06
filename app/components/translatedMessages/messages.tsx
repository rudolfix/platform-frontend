import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../config/externalRoutes";
import { TTranslatedString } from "../../types";
import { TMessage } from "./utils";

interface ITranslationValues {
  [SignInUserErrorMessages: string]: string;
}

export type TranslatedMessageType =
  | GenericError
  | SignInUserErrorMessage
  | BrowserWalletErrorMessage
  | LedgerErrorMessage
  | LightWalletErrorMessage
  | SignerErrorMessage
  | MismatchedWalletAddressErrorMessage
  | BackupRecovery;

export enum GenericError {
  GENERIC_ERROR = "genericError",
  USER_ALREADY_EXISTS = "userAlreadyExists",
}

export enum SignInUserErrorMessage {
  MESSAGE_SIGNING_REJECTED = "messageSigningRejected",
  MESSAGE_SIGNING_TIMEOUT = "messageSigningTimeout",
  MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE = "serverConnectionFailure",
}

export enum BrowserWalletErrorMessage {
  WALLET_IS_LOCKED = "walletIsLocked",
  WALLET_CONNECTED_TO_WRONG_NETWORK = "browserWalletConnectedToWrongNetwork",
  WALLET_NOT_ENABLED = "browserWalletNotEnabled",
  ACCOUNT_APPROVAL_REJECTED = "browserWalletAccountApprovalRejected",
  ACCOUNT_APPROVAL_PENDING = "browserWalletAccountApprovalPending",
  GENERIC_ERROR = "browserWalletGenericError",
}

export enum LedgerErrorMessage {
  LEDGER_LOCKED = "ledgerLocked",
  GENERIC_ERROR = "ledgerGenericError",
}

export enum LightWalletErrorMessage {
  WRONG_PASSWORD_SALT = "lightWalletWrongPasswordSalt",
  SIGN_MESSAGE = "lightWalletSignMessage",
  CREATION_ERROR = "lightWalletCreationError",
  DESERIALIZE = "lightWalletDeserialize",
  ENCRYPTION_ERROR = "lightWalletEncryptionError",
  WRONG_PASSWORD = "lightWalletWrongPassword",
  WRONG_MNEMONIC = "lightWalletWrongMnemonic",
  GENERIC_ERROR = "lightWalletGenericError",
}

export enum SignerErrorMessage {
  CONFIRMATION_REJECTED = "signerRejectedConfirmation",
  TIMEOUT = "signerTimeout",
  GENERIC_ERROR = "signerGenericError",
}

export enum MismatchedWalletAddressErrorMessage {
  MISMATCHED_WALLET_ADDRESS = "mismatchedWalletAddress",
}

export enum BackupRecovery {
  BACKUP_SUCCESS_TITLE = "backupSuccessTitle",
  BACKUP_SUCCESS_DESCRIPTION = "backupSuccessDescription",
}

export const getMessageTranslation = ({
  messageType,
  messageData,
}: TMessage): TTranslatedString => {
  switch (messageType) {
    case BackupRecovery.BACKUP_SUCCESS_TITLE:
      return <FormattedMessage id="modules.wallet-selector.light-wizard.sagas.backup-recovery" />;
    case BackupRecovery.BACKUP_SUCCESS_DESCRIPTION:
      return (
        <FormattedMessage id="modules.wallet-selector.light-wizard.sagas.successfully.backed-up" />
      );

    case GenericError.GENERIC_ERROR:
      return <FormattedMessage id="error-message.generic-error" />;
    case GenericError.USER_ALREADY_EXISTS:
      return <FormattedMessage id="modules.auth.sagas.sign-in-user.email-already-exists" />;
    case SignInUserErrorMessage.MESSAGE_SIGNING_REJECTED:
      return <FormattedMessage id="modules.auth.sagas.sign-in-user.message-signing-was-rejected" />;
    case SignInUserErrorMessage.MESSAGE_SIGNING_TIMEOUT:
      return <FormattedMessage id="modules.auth.sagas.sign-in-user.message-signing-timeout" />;
    case SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE:
      return (
        <FormattedHTMLMessage
          tagName="span"
          id="modules.auth.sagas.sign-in-user.error-our-servers-are-having-problems"
          values={{ url: `${externalRoutes.neufundSupport}/home` }}
        />
      );

    case BrowserWalletErrorMessage.WALLET_IS_LOCKED:
      return <FormattedMessage id="error-message.browser-wallet.wallet-locked" />;
    case BrowserWalletErrorMessage.WALLET_CONNECTED_TO_WRONG_NETWORK:
      return (
        <FormattedMessage id="error-message.browser-wallet.wallet-connected-to-wrong-network" />
      );
    case BrowserWalletErrorMessage.WALLET_NOT_ENABLED:
      return <FormattedMessage id="error-message.browser-wallet.wallet-not-enabled" />;
    case BrowserWalletErrorMessage.ACCOUNT_APPROVAL_REJECTED:
      return <FormattedMessage id="error-message.browser-wallet.account-approval-rejected" />;
    case BrowserWalletErrorMessage.ACCOUNT_APPROVAL_PENDING:
      return <FormattedMessage id="error-message.browser-wallet.account-approval-pending" />;
    case BrowserWalletErrorMessage.GENERIC_ERROR:
      return <FormattedMessage id="error-message.browser-wallet.generic-error" />;

    case LedgerErrorMessage.LEDGER_LOCKED:
      return <FormattedMessage id="error-message.ledger.ledger-locked" />;
    case LedgerErrorMessage.GENERIC_ERROR:
      return <FormattedMessage id="error-message.ledger.generic-error" />;

    case LightWalletErrorMessage.WRONG_PASSWORD_SALT:
      return <FormattedMessage id="error-message.light-wallet.wrong-password-salt" />;
    case LightWalletErrorMessage.SIGN_MESSAGE:
      return <FormattedMessage id="error-message.light-wallet.sign-message" />;
    case LightWalletErrorMessage.CREATION_ERROR:
      return <FormattedMessage id="error-message.light-wallet.creation-error" />;
    case LightWalletErrorMessage.DESERIALIZE:
      return <FormattedMessage id="error-message.light-wallet.deserialize" />;
    case LightWalletErrorMessage.ENCRYPTION_ERROR:
      return <FormattedMessage id="error-message.light-wallet.encryption-error" />;
    case LightWalletErrorMessage.WRONG_PASSWORD:
      return <FormattedMessage id="error-message.light-wallet.wrong-password" />;
    case LightWalletErrorMessage.WRONG_MNEMONIC:
      return <FormattedMessage id="error-message.light-wallet.wrong-mnemonic" />;
    case LightWalletErrorMessage.GENERIC_ERROR:
      return <FormattedMessage id="error-message.light-wallet.generic-error" />;

    case SignerErrorMessage.CONFIRMATION_REJECTED:
      return <FormattedMessage id="error-message.signer.signer-rejected-confirmation" />;
    case SignerErrorMessage.TIMEOUT:
      return <FormattedMessage id="error-message.signer.timeout" />;
    case SignerErrorMessage.GENERIC_ERROR:
      return <FormattedMessage id="error-message.signer.generic-error" />;

    case MismatchedWalletAddressErrorMessage.MISMATCHED_WALLET_ADDRESS:
      return (
        <FormattedMessage
          id="error-message.mismatched-wallet-address"
          values={messageData as ITranslationValues}
        />
      );
  }
};
