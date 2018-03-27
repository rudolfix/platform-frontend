import * as React from "react";
import * as styles from "./MethodEth.module.scss";

import * as icon from "../../../assets/img/eth_icon.svg";
import { Money } from "../../shared/Money";

export const MethodEth = () => {
  return (
    <div className={styles.methodEth}>
      <h2 className={styles.title}>
        Deposit <img src={icon} className={styles.icon} alt="ETH icon" /> ETH to your wallet
      </h2>
      <p className={styles.description}>
        You will receive an e-mail notification once your funds have been successfully deposited!
      </p>
      <div className={styles.background}>
        <div className={styles.qrcodeWrapper}>
          <div className={styles.label}>ETH ADDRESS</div>
          <div className={styles.qrcodeMock} />
        </div>
        <div className={styles.details}>
          <div className={styles.label}>ETH ADDRESS</div>
          <div className={styles.ethAddress}>0x32Be343B94f860124dC4fEe278FDCBD38C102D88</div>
          <div className={styles.label}>ETH PRICE TODAY</div>
          <span className={styles.moneyWrapper}>
            <Money currency="eur" value={"600000" + "0".repeat(16)} />
          </span>
        </div>
      </div>
    </div>
  );
};
