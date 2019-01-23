import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Proportion } from "./Proportion";

import * as styles from "./EtoOfferingSoon.module.scss";

export interface IEtoOfferingSoonProps {
  description: string | React.ReactNode;
  className?: string;
}

export const EtoOfferingSoon: React.FunctionComponent<IEtoOfferingSoonProps> = ({
  description,
  className,
}) => {
  return (
    <Proportion className={className}>
      <div className={styles.card}>
        <h3 className={styles.title}>
          <FormattedMessage id="landing.eto-offering-card-soon.title" />
        </h3>
        <p className={styles.description}>{description}</p>
      </div>
    </Proportion>
  );
};
