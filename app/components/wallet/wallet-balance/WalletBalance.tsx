import * as React from "react";
import { FormattedMessage } from "react-intl";

import { selectEthereumAddress } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { AccountAddress, IAccountAddressProps } from "../../shared/AccountAddress";
import { Button } from "../../shared/Buttons";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget";
import { IPanelProps, Panel } from "../../shared/Panel";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as arrowRightIcon from "../../../assets/img/inline_icons/arrow_right.svg";
import { actions } from "../../../modules/actions";
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
  avatar,
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
      <AccountAddress avatar={avatar} address={address} />

      <div className={styles.accountBalanceWrapper}>
        <div>
          <h4 className={styles.title}>
            <FormattedMessage id="shared-component.wallet-balance.title.account-balance" />
          </h4>
          <MoneySuiteWidget
            icon={ethIcon}
            currency="eth"
            currencyTotal="eur"
            largeNumber={data!.ethAmount}
            value={data!.ethEuroAmount}
          />
        </div>
        <div className={styles.buttonsWrapper}>
          <Button
            layout="secondary"
            iconPosition="icon-after"
            svgIcon={arrowRightIcon}
            onClick={withdrawEth}
          >
            <FormattedMessage id="shared-component.wallet-balance.withdraw" />
          </Button>
          <Button
            layout="secondary"
            iconPosition="icon-after"
            svgIcon={arrowRightIcon}
            onClick={depositEth}
          >
            <FormattedMessage id="shared-component.wallet-balance.deposit" />
          </Button>
        </div>
      </div>
    </div>
  );

  const IcbmLocked = (
    <div className={styles.icbmLockedWallet}>
      <p className={styles.message}>
        ICBM investors please upgrade your wallet to continue using the platform{" "}
      </p>
      <Button
        layout="secondary"
        iconPosition="icon-after"
        svgIcon={arrowRightIcon}
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
