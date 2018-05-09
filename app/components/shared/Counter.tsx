import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import * as styles from "./Counter.module.scss";

interface IProps {
  endDate?: Date
}

const Counter: React.SFC<IProps> = ({endDate}) => {
  const now = new Date();

  return (
    <div className={styles.counter}>
      <div className={styles.wrapper}>
        <div className={styles.plate}>
          01
        </div>
        <div className={styles.label}>
          <FormattedMessage id="counter.label.days" />
        </div>
      </div>
      {":"}
      <div className={styles.wrapper}>
        <div className={styles.plate}>
          01
        </div>
        <div className={styles.label}>
        <FormattedMessage id="counter.label.hours" />
        </div>
      </div>
      {":"}
      <div className={styles.wrapper}>
        <div className={styles.plate}>
          01
        </div>
        <div className={styles.label}>
          <FormattedMessage id="counter.label.minutes" />
        </div>
      </div>
    </div>
  )
};

export default Counter;
