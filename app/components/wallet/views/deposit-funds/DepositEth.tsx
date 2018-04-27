import * as React from "react";
import * as styles from "./DepositEth.module.scss";
import { DepositFunds } from "./DepositFunds";

import { compose } from "redux";
import * as icon from "../../../../assets/img/eth_icon.svg";
import { selectEthereumAddress } from "../../../../modules/web3/reducer";
import { appConnect } from "../../../../store";

interface IProps {
  path: string;
}

interface IStateProps {
  ethAddress: string;
}

export const DepositEthComponent: React.SFC<IProps & IStateProps> = ({ path, ethAddress }) => {
  return (
    <DepositFunds path={path}>
      <div className={styles.methodEth}>
        <h2 className={styles.title}>
          Deposit <img src={icon} className={styles.icon} alt="ETH icon" /> ETH to your wallet
        </h2>
        <p className={styles.description}>
          You will receive an e-mail notification once your funds have been successfully deposited!
        </p>
        <div className={styles.background}>
          <div className={styles.details}>
            <div className={styles.label}>Your ETH address</div>
            <div className={styles.ethAddress}>{ethAddress}</div>
          </div>
        </div>
      </div>
    </DepositFunds>
  );
};

export const DepositEth = compose(
  appConnect<IStateProps>({
    stateToProps: s => ({
      ethAddress: selectEthereumAddress(s.web3),
    }),
  }),
)(DepositEthComponent);
