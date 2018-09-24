import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { AccountBalance } from '../../shared/AccountBalance';
import { HorizontalLine } from "../../shared/HorizontalLine";
import { IPanelProps } from "../../shared/Panel";
import { IWalletValues, WalletBalanceContainer } from './WalletBalance';

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as neuroIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./WalletBalance.module.scss";


interface IIcbmWallet extends IPanelProps {
    onUpgradeEtherClick?: () => void;
    onUpgradeEuroClick?: () => void;
    data: IWalletValues;
  }
  
  export const IcbmWallet: React.SFC<IIcbmWallet> = ({
    data,
    className,
    headerText,
    onUpgradeEtherClick,
    onUpgradeEuroClick,
  }) => {
    return (
      <WalletBalanceContainer {...{ className, headerText }}>
        <div className={styles.icbmLockedWallet}>
          <p className={styles.message}>
            <FormattedMessage id="shared-component.wallet-icbm.upgrade-message" />
          </p>
  
          <h4 className={styles.title}>
            <FormattedMessage id="shared-component.wallet-balance.title.account-balance" />
          </h4>
          <AccountBalance
            icon={neuroIcon}
            currency="eur_token"
            currencyTotal="eur"
            largeNumber={data.neuroAmount}
            value={data.neuroEuroAmount}
            onUpgradeClick={onUpgradeEuroClick}
          />
  
          <HorizontalLine className="my-3" />
  
          <AccountBalance
            icon={ethIcon}
            currency="eth"
            currencyTotal="eur"
            largeNumber={data.ethAmount}
            value={data.ethEuroAmount}
            onUpgradeClick={onUpgradeEtherClick}
          />
        </div>
      </WalletBalanceContainer>
    );
  };
  