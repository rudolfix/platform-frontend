import React from "react";

import { TokenIcon } from "../icons";

import * as styles from "./TokenDetails.module.scss";

type TExternalProps = {
  equityTokenName: string;
  equityTokenSymbol: string;
  equityTokenImage: string;
};

const TokenDetails: React.FunctionComponent<TExternalProps> = ({
  equityTokenName,
  equityTokenSymbol,
  equityTokenImage,
  children,
}) => (
  <section className={styles.container} data-test-id={`token-details-${equityTokenName}`}>
    <TokenIcon className={styles.icon} srcSet={{ "1x": equityTokenImage }} alt="" />
    <div className={styles.meta}>
      <p className={styles.tokenName}>
        {equityTokenName} ({equityTokenSymbol})
      </p>
      {children}
    </div>
  </section>
);

export { TokenDetails };
