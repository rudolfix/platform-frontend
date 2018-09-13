import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { actions } from "../../../modules/actions";
import { selectEthereumAddressWithChecksum } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { CommonHtmlProps } from "../../../types";
import { AccountAddress, IAccountAddressProps } from "../../shared/AccountAddress";
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

interface IWalletBalanceProps {
  isLoading: boolean;
  data?: IWalletValues;
  isLocked: boolean;
}

interface IStateProps {
  address: string;
}

interface IDispatchProps {
  depositEth: () => void;
  withdrawEth: () => void;
}

type IProps = IPanelProps &
  IWalletBalanceProps &
  IStateProps &
  IDispatchProps &
  IAccountAddressProps &
  CommonHtmlProps;

const WalletBalanceComponent: React.SFC<IProps> = ({
  isLoading,
  headerText,
  address,
  data,
  depositEth,
  withdrawEth,
  isLocked,
  className,
}) => {
  const unlockedWallet = (
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
          largeNumber={data!.neuroAmount}
          value={data!.neuroEuroAmount}
          onWithdrawClick={withdrawEth}
          // TODO: add on depositClick when euro token flow exists
        />

        <HorizontalLine className="my-3" />

        <AccountBalance
          icon={ethIcon}
          currency="eth"
          currencyTotal="eur"
          largeNumber={data!.ethAmount}
          value={data!.ethEuroAmount}
          onWithdrawClick={withdrawEth}
          onDepositClick={depositEth}
        />
      </div>
    </div>
  );

  const IcbmLocked = (
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
        largeNumber={data!.neuroAmount}
        value={data!.neuroEuroAmount}
        onUpgradeClick={() => {}}
      />

      <HorizontalLine className="my-3" />

      <AccountBalance
        icon={ethIcon}
        currency="eth"
        currencyTotal="eur"
        largeNumber={data!.ethAmount}
        value={data!.ethEuroAmount}
        onUpgradeClick={() => {}}
      />
    </div>
  );

  return (
    <Panel
      headerText={headerText}
      rightComponent={data && <TotalEuro totalEurValue={data.totalEuroAmount} />}
      className={cn(className, "d-flex flex-column")}
    >
      {isLoading ? <LoadingIndicator /> : isLocked ? IcbmLocked : unlockedWallet}
    </Panel>
  );
};

export const WalletBalance = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    address: selectEthereumAddressWithChecksum(state.web3),
  }),
  dispatchToProps: dispatch => ({
    depositEth: () => dispatch(actions.depositEthModal.showDepositEthModal()),
    withdrawEth: () => dispatch(actions.txSender.startWithdrawEth()),
  }),
})(WalletBalanceComponent);
