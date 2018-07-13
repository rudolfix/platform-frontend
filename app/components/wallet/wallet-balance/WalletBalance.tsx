import * as React from "react";
import { FormattedMessage } from "react-intl";

import { selectEthereumAddress } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { AccountAddress, IAccountAddressProps } from "../../shared/AccountAddress";
import { Button } from "../../shared/Buttons";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { IPanelProps, Panel } from "../../shared/Panel";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as arrowRightIcon from "../../../assets/img/inline_icons/arrow_right.svg";
import { actions } from "../../../modules/actions";
import { AccountBalance } from "../../shared/AccountBalance";
import * as styles from "./WalletBalance.module.scss";

export interface IWalletValues {
  ethAmount: string;
  ethEuroAmount: string;
}

interface IWalletBalanceProps {
  isLoading: boolean;
  data?: IWalletValues;
  isLocked: boolean;
  isIcbmLocked?: boolean;
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
  IAccountAddressProps;

const WalletBalanceComponent: React.SFC<IProps> = ({
  isLoading,
  headerText,
  address,
  data,
  isIcbmLocked,
  depositEth,
  withdrawEth,
}) => {
  const unlockedWallet = (
    <div>
      <h4 className={styles.title}>
        <FormattedMessage id="shared-component.wallet-balance.title.account-address" />
      </h4>
      <AccountAddress address={address} />

      <h4 className={styles.title}>
        <FormattedMessage id="shared-component.wallet-balance.title.account-balance" />
      </h4>
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
  );

  const IcbmLocked = (
    <div className={styles.icbmLockedWallet}>
      <p className={styles.message}>
        ICBM investors please upgrade your wallet to continue using the platform{" "}
      </p>
      <Button
        layout="simple"
        iconPosition="icon-after"
        svgIcon={arrowRightIcon}
        theme="graphite"
        onClick={() => {}}
      >
        Upgrade wallet
      </Button>
    </div>
  );

  return (
    <Panel headerText={headerText}>
      {isLoading ? <LoadingIndicator /> : isIcbmLocked ? IcbmLocked : unlockedWallet}
    </Panel>
  );
};

export const WalletBalance = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    address: selectEthereumAddress(state.web3),
  }),
  dispatchToProps: dispatch => ({
    depositEth: () => dispatch(actions.depositEthModal.showDepositEthModal()),
    withdrawEth: () => dispatch(actions.sendEthModal.showSendEthModal()),
  }),
})(WalletBalanceComponent);
