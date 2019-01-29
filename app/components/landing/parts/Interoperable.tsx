import * as React from "react";

import * as styles from "./Interoperable.module.scss";

export const Interoperable: React.FunctionComponent = () => (
  <div className={styles.wrapper}>
    <div className={styles.loader}>
      <div className={styles.ring} />
      <div className={styles.spheres}>
        <div className={styles.sphere} />
        <div className={styles.sphere} />
        <div className={styles.sphere} />
      </div>
    </div>
  </div>
);
