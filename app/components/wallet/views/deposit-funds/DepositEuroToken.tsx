import * as React from "react";
import * as styles from "./DepositEuroToken.module.scss";
import { DepositFunds } from "./DepositFunds";

import * as icon from "../../../../assets/img/nEUR_icon.svg";

interface IProps {
  path: string;
}

export const DepositEuroToken: React.SFC<IProps> = ({ path }) => {
  return (
    <DepositFunds path={path}>
      <div className={styles.methodEuroToken}>
        <h2 className={styles.title}>
          Deposit <img src={icon} className={styles.icon} alt="nEUR icon" /> nEUR to your wallet
        </h2>
        <p className={styles.description}>
          Transfer the amount you wish to deposit to the bank account below, using the exact
          reference.<br />You will receive an e-mail notification once your funds have been
          successfully deposited!
        </p>
        <div className={styles.background}>
          <div className={styles.details}>
            <div className={styles.label}>Beneficiary</div>
            <div className={styles.value}>-</div>
            <div className={styles.label}>IBAN</div>
            <div className={styles.value}>-</div>
            <div className={styles.label}>BIC</div>
            <div className={styles.value}>-</div>
            <div className={styles.label}>Reference</div>
            <div className={styles.value}>-</div>
          </div>
          <div className={styles.currencyDetails}>
            <div className={styles.label}>nEUR VALUE</div>
            <div className={styles.exchangeRate}>1nEUR = 1€</div>
          </div>
        </div>
      </div>
    </DepositFunds>
  );
};
