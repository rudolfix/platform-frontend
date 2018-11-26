import * as React from "react";

import { TTranslatedString } from "../../../types";

import * as styles from "./NeonHeader.module.scss";

interface IExternalProps {
  children: TTranslatedString;
}

const NeonHeader: React.SFC<IExternalProps> = ({ children }) => (
  <header className={styles.neonHeaderWrapper}>
    <div className={styles.neon} />
    <h1 className={styles.neonHeader}>{children}</h1>
  </header>
);

export { NeonHeader };
