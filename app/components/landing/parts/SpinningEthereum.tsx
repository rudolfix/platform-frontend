import * as React from "react";

import * as styles from "./SpinningEthereum.module.scss";

export const SpinningEthereum: React.SFC = () => (
  <div className={styles.wrapper}>
    <div className={styles.eth}>
      <div className={styles.bottom}>
        <div className={styles.left} />
        <div className={styles.right} />
        <div className={styles.up} />
        <div className={styles.down} />
      </div>

      <div className={styles.top}>
        <div className={styles.left} />
        <div className={styles.right} />
        <div className={styles.up} />
        <div className={styles.down} />
      </div>
    </div>
  </div>
);
