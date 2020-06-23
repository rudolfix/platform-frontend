import { EWalletSubType, EWalletType } from "@neufund/shared-modules";
import { assertNever } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose } from "recompose";

import { actions } from "../../../modules/actions";
import { selectWalletSubType, selectWalletType } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { shouldNeverHappen } from "../../shared/NeverComponent";
import { EWarningAlertSize, WarningAlert } from "../../shared/WarningAlert";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { AccessLightWalletPrompt } from "./AccessLightWalletPrompt";
import { AccessWalletLayoutBase, AccessWalletModalLogo } from "./AccessWalletLayoutBase";

import neufundLogo from "../../../assets/img/logo_small_black.svg";
import gnosisLogo from "../../../assets/img/wallet_selector/gnosis.svg";
import ledgerIcon from "../../../assets/img/wallet_selector/ledger.svg";
import lockIcon from "../../../assets/img/wallet_selector/lock_icon.svg";
import logoMetamask from "../../../assets/img/wallet_selector/metamask.svg";
import wcLogo from "../../../assets/img/wallet_selector/wallet_connect_logo.svg";
import * as styles from "./AccessWalletModal.module.scss";

type TStateProps = {
  errorMessage?: TTranslatedString;
  title?: TTranslatedString;
  message?: TTranslatedString;
  walletType: EWalletType | undefined;
  walletSubType: EWalletSubType | undefined;
  inputLabel?: TTranslatedString;
};

type TDispatchProps = {
  onAccept: (password?: string) => void;
  tryToAccessWalletAgain: () => void;
};

type TExternalProps = {
  title?: TTranslatedString;
  message?: TTranslatedString;
};

type TComponentProps = {
  errorMessage?: TTranslatedString;
  title?: TTranslatedString;
  message?: TTranslatedString;
  walletType: EWalletType;
  walletSubType: EWalletSubType | undefined;
  inputLabel?: TTranslatedString;
} & TDispatchProps &
  TExternalProps;

export const AccessWalletLayout: React.FunctionComponent<TComponentProps> = ({
  title,
  message,
  errorMessage,
  onAccept,
  tryToAccessWalletAgain,
  walletType,
  walletSubType,
  inputLabel,
}) => {
  switch (walletType) {
    case EWalletType.LIGHT:
      return (
        <>
          <AccessWalletModalLogo logo={lockIcon} />
          {title && <h1 className={styles.title}>{title}</h1>}
          {message && <p>{message}</p>}
          <AccessLightWalletPrompt onAccept={onAccept} inputLabel={inputLabel} />
          {errorMessage && (
            <WarningAlert
              size={EWarningAlertSize.BIG}
              className={styles.errorMessage}
              data-test-id="access-wallet.error-msg"
            >
              {errorMessage}
            </WarningAlert>
          )}
        </>
      );
    case EWalletType.LEDGER:
      return (
        <AccessWalletLayoutBase
          logo={ledgerIcon}
          title={title}
          message={message}
          info={<FormattedMessage id="modal.access-wallet.ledger-info" />}
          errorMessage={errorMessage}
          tryToAccessWalletAgain={tryToAccessWalletAgain}
        />
      );
    case EWalletType.BROWSER:
      return (
        <AccessWalletLayoutBase
          logo={walletSubType === EWalletSubType.GNOSIS ? gnosisLogo : logoMetamask}
          title={title}
          message={message}
          info={
            walletSubType === EWalletSubType.GNOSIS ? (
              <FormattedMessage id="modal.access-wallet.gnosis-info" />
            ) : (
              <FormattedMessage id="modal.access-wallet.metamask-info" />
            )
          }
          errorMessage={errorMessage}
          tryToAccessWalletAgain={tryToAccessWalletAgain}
        />
      );
    case EWalletType.WALLETCONNECT:
      return (
        <AccessWalletLayoutBase
          logo={walletSubType === EWalletSubType.NEUFUND ? neufundLogo : wcLogo}
          title={title}
          message={message}
          info={
            walletSubType === EWalletSubType.NEUFUND ? (
              <FormattedMessage id="modal.access-wallet.walletconnect-neufund-info" />
            ) : (
              <FormattedMessage id="modal.access-wallet.walletconnect-unknown-info" />
            )
          }
          errorMessage={errorMessage}
          tryToAccessWalletAgain={tryToAccessWalletAgain}
        />
      );
    case EWalletType.UNKNOWN:
    case EWalletType.MOBILE:
      return (
        <AccessWalletLayoutBase
          title={title}
          message={message}
          errorMessage={errorMessage}
          tryToAccessWalletAgain={tryToAccessWalletAgain}
        />
      );
    default:
      assertNever(walletType, "unknown wallet type");
  }
};

export const AccessWallet = compose<TComponentProps, TExternalProps>(
  appConnect<TStateProps, TDispatchProps, TExternalProps>({
    stateToProps: (s, props) => ({
      errorMessage: s.accessWallet.errorMessage
        ? getMessageTranslation(s.accessWallet.errorMessage)
        : undefined,
      title: props.title
        ? props.title
        : s.accessWallet.modalTitle && getMessageTranslation(s.accessWallet.modalTitle),
      message: props.message
        ? props.message
        : s.accessWallet.modalMessage && getMessageTranslation(s.accessWallet.modalMessage),
      inputLabel: s.accessWallet.inputLabel && getMessageTranslation(s.accessWallet.inputLabel),
      walletType: selectWalletType(s),
      walletSubType: selectWalletSubType(s.web3),
    }),
    dispatchToProps: dispatch => ({
      onAccept: (password?: string) => {
        dispatch(actions.accessWallet.tryToAccessWalletAgain());
        dispatch(actions.accessWallet.accept(password));
      },
      tryToAccessWalletAgain: () => dispatch(actions.accessWallet.tryToAccessWalletAgain()),
    }),
  }),
  branch<TStateProps>(
    ({ walletType }) => walletType === undefined,
    shouldNeverHappen("unknown wallet type"),
  ),
)(AccessWalletLayout);
