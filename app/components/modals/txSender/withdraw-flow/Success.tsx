import * as React from "react";
import { ConfettiEthereum } from "../../../landing/parts/ConfettiEthereum";

import * as styles from "./Success.module.scss";

export const WithdrawSuccess = () => (
  <div className="text-center">
    <ConfettiEthereum className="mb-3" />
    <h3 className={styles.title}>Transaction confirmed</h3>
  </div>
);
