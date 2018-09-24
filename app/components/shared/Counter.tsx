import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import * as styles from "./Counter.module.scss";

interface IProps {
  endDate: number;
}

interface IState {
  date: number;
}

const day = 86400000;
const hour = day / 24;
const minute = hour / 60000;

export class Counter extends React.Component<IProps, IState> {
  interval: number | null = null;

  state = {
    date: this.props.endDate - Date.now(),
  };

  componentDidMount(): void {
    this.interval = window.setInterval(() => {
      this.setState(state => ({ date: state.date - 1000 }));
    }, 1000);
  }

  componentWillUnmount(): void {
    if (this.interval !== null) {
      window.clearInterval(this.interval);
    }
  }

  render(): React.ReactNode {
    const { date } = this.state;

    const computedDays = parseInt(`${date / day}`, 10);
    const computedHours = parseInt(`${(((date / day) % computedDays) * day) / hour}`, 10);
    const computedMinutes = parseInt(
      `${(((((date / day) % computedDays) * day) / hour) % computedHours) * minute}`,
      10,
    );

    return (
      <div className={styles.counter}>
        <div className={styles.wrapper}>
          <div className={styles.plate}>{computedDays}</div>
          <div className={styles.label}>
            <FormattedMessage id="counter.label.days" />
          </div>
        </div>
        {":"}
        <div className={styles.wrapper}>
          <div className={styles.plate}>{computedHours}</div>
          <div className={styles.label}>
            <FormattedMessage id="counter.label.hours" />
          </div>
        </div>
        {":"}
        <div className={styles.wrapper}>
          <div className={styles.plate}>{computedMinutes}</div>
          <div className={styles.label}>
            <FormattedMessage id="counter.label.minutes" />
          </div>
        </div>
      </div>
    );
  }
}
