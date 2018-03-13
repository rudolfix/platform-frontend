import * as React from "react";
import * as styles from "./TotalEuro.module.scss";

import { Money } from "../shared/Money";

interface ITotalEuroProps {
  totalEurValue: string;
}

export const TotalEuro: React.SFC<ITotalEuroProps> = ({ totalEurValue }) => (
  <div className={styles.totalEuro}>
    <span className={styles.label}>TOTAL</span>
    <Money
      currency={"eur"}
      value={totalEurValue}
      style={{ fontSize: "20px", color: "#20e06e", fontWeight: 600 }}
      currencyStyle={{ fontSize: "16px", fontWeight: 500 }}
    />
  </div>
);
