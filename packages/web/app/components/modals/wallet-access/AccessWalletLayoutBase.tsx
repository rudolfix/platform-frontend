import { Button } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../../types";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { EWarningAlertSize, WarningAlert } from "../../shared/WarningAlert";

import * as styles from "./AccessWalletModal.module.scss";

type TAccessWalletErrorProps = {
  errorMessage: TTranslatedString | undefined;
  tryToAccessWalletAgain: () => void;
};

type TAccessWalletModalLogoProps = {
  logo: string;
};

type TAccessWalletLayoutBaseProps = {
  logo?: string;
  title?: TTranslatedString;
  message?: TTranslatedString;
  info?: TTranslatedString;
  errorMessage?: TTranslatedString;
  tryToAccessWalletAgain: () => void;
};

export const AccessWalletModalLogo: React.FunctionComponent<TAccessWalletModalLogoProps> = ({
  logo,
}) => (
  <div className={styles.walletLogoWrapper}>
    <img src={logo} className={styles.walletLogo} alt="" />
  </div>
);

const AccessWalletError: React.FunctionComponent<TAccessWalletErrorProps> = ({
  errorMessage,
  tryToAccessWalletAgain,
}) => (
  <>
    <WarningAlert
      size={EWarningAlertSize.BIG}
      className={styles.errorMessage}
      data-test-id="access-wallet.error-msg"
    >
      {errorMessage}
    </WarningAlert>
    <Button
      onClick={tryToAccessWalletAgain}
      data-test-id="access-wallet.try-again"
      className={styles.tryAgainButtun}
    >
      <FormattedMessage id="common.try-again" />
    </Button>
  </>
);

export const AccessWalletLayoutBase: React.FunctionComponent<TAccessWalletLayoutBaseProps> = ({
  logo,
  title,
  message,
  info,
  errorMessage,
  tryToAccessWalletAgain,
}) => (
  <>
    {logo && <AccessWalletModalLogo logo={logo} />}
    {title && <h1 className={styles.title}>{title}</h1>}
    {message && <p>{message}</p>}
    {info && <div className={styles.info}>{info}</div>}
    {errorMessage ? (
      <AccessWalletError
        errorMessage={errorMessage}
        tryToAccessWalletAgain={tryToAccessWalletAgain}
      />
    ) : (
      <LoadingIndicator className={styles.loadingIndicator} />
    )}
  </>
);
