import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EWalletType } from "../../../modules/web3/types";
import { appRoutes } from "../../appRoutes";
import { ButtonLink } from "../../shared/buttons/ButtonLink";

import emailIcon from "../../../assets/img/wallet_selector/email-alt.svg";
import ledgerLogo from "../../../assets/img/wallet_selector/ledger.svg";
import metamaskLogo from "../../../assets/img/wallet_selector/metamask.svg";
import styles from "./RegisterWalletSelector.module.scss";

type TWalletChooserProps = {
  isLogin: boolean;
  activeWallet: EWalletType;
};

export const WalletChooser: React.FunctionComponent<TWalletChooserProps> = ({
  isLogin,
  activeWallet,
}) => {
  const path = isLogin ? appRoutes.login : appRoutes.register;
  return (
    <>
      <section className={styles.walletChooserContainer}>
        <p className={styles.walletChooserText}>
          <FormattedMessage id="wallet-selector.wallet-chooser" />
        </p>
        <div className={styles.walletChooserButtons}>
          {activeWallet !== EWalletType.LIGHT && (
            <ButtonLink data-test-id="wallet-selector-light" to={`${path}/light`}>
              <img src={emailIcon} alt="" className={styles.img} />
              <FormattedMessage id="wallet-selector.lightwallet" />
            </ButtonLink>
          )}

          {activeWallet !== EWalletType.BROWSER && (
            <ButtonLink data-test-id="wallet-selector-browser" to={`${path}/browser`}>
              <img src={metamaskLogo} alt="" className={styles.img} />
              <FormattedMessage id="wallet-selector.browser-wallet" />
            </ButtonLink>
          )}
          {activeWallet !== EWalletType.LEDGER && (
            <ButtonLink data-test-id="wallet-selector-ledger" to={`${path}/ledger`}>
              <img src={ledgerLogo} alt="" className={styles.img} />
              <FormattedMessage id="wallet-selector.ledger" />
            </ButtonLink>
          )}
        </div>
      </section>
    </>
  );
};
