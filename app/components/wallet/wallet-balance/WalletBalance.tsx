import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps } from "../../../types";
import { AccountAddress } from "../../shared/AccountAddress";
import { AccountBalance } from "../../shared/AccountBalance";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { IPanelProps, Panel } from "../../shared/Panel";
import { TotalEuro } from "../TotalEuro";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as neuroIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./WalletBalance.module.scss";

export interface IWalletValues {
  ethAmount: string;
  ethEuroAmount: string;
  neuroAmount: string;
  neuroEuroAmount: string;
  totalEuroAmount: string;
}

interface IUnlockedWallet extends IPanelProps {
  depositEth: () => void;
  withdrawEth: () => void;
  data: IWalletValues;
  address: string;
}

export const UnlockedWallet: React.SFC<IUnlockedWallet> = ({
  address,
  data,
  depositEth,
  withdrawEth,
  className,
  headerText,
}) => {
  return (
    <WalletBalanceContainer {...{ className, headerText }}>
      <div className={styles.accountWithAddressWrapper}>
        <div>
          <h4 className={styles.title}>
            <FormattedMessage id="shared-component.wallet-balance.title.account-address" />
          </h4>
          <AccountAddress address={address} />
        </div>

        <div>
          <h4 className={styles.title}>
            <FormattedMessage id="shared-component.wallet-balance.title.account-balance" />
          </h4>
          <AccountBalance
            icon={neuroIcon}
            currency="eur_token"
            currencyTotal="eur"
            largeNumber={data.neuroAmount}
            value={data.neuroEuroAmount}
            onWithdrawClick={withdrawEth}
            // TODO: add on depositClick when euro token flow exists
          />

          <HorizontalLine className="my-3" />

          <AccountBalance
            icon={ethIcon}
            currency="eth"
            currencyTotal="eur"
            largeNumber={data.ethAmount}
            value={data.ethEuroAmount}
            onWithdrawClick={withdrawEth}
            dataTestId="wallet-balance.ether"
            onDepositClick={depositEth}
          />
        </div>
      </div>
    </WalletBalanceContainer>
  );
};

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

interface ILockedWallet extends IPanelProps {
  data: IWalletValues;
}

export const LockedWallet: React.SFC<ILockedWallet> = ({ data, className, headerText }) => {
  return (
    <WalletBalanceContainer {...{ className, headerText }}>
      <div className={styles.icbmLockedWallet}>
        <p className={styles.message}>
          <FormattedMessage id="shared-component.wallet-icbm.already-upgraded-message" />
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
        />

        <HorizontalLine className="my-3" />

        <AccountBalance
          icon={ethIcon}
          currency="eth"
          currencyTotal="eur"
          largeNumber={data.ethAmount}
          value={data.ethEuroAmount}
        />
      </div>
    </WalletBalanceContainer>
  );
};

export const LoadingWallet: React.SFC<IPanelProps> = props => {
  return (
    <WalletBalanceContainer {...props}>
      <LoadingIndicator />
    </WalletBalanceContainer>
  );
};

const WalletBalanceContainer: React.SFC<
  IPanelProps &
    CommonHtmlProps & {
      data?: IWalletValues;
    }
> = ({ headerText, data, className, children }) => {
  return (
    <Panel
      headerText={headerText}
      rightComponent={data && <TotalEuro totalEurValue={data.totalEuroAmount} />}
      className={cn(className, "d-flex flex-column")}
    >
      {children}
    </Panel>
  );
};
