import * as React from "react";

import { FormattedMessage } from "react-intl-phraseapp";

import * as styles from "./EtoOfferingSoon.module.scss";

interface IProps {
  description: string | React.ReactNode;
}

export const EtoOfferingSoon: React.SFC<IProps> = ({ description }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        <FormattedMessage id="landing.eto-offering-card-soon.title" />
      </h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};
