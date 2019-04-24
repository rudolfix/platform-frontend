import * as moment from "moment";
import * as React from "react";

import { Counter } from "../../../shared/Counter.unsafe";

import * as styles from "./CounterWidget.module.scss";

export interface ICounterWidgetProps {
  endDate: Date;
}

const CounterWidget: React.FunctionComponent<ICounterWidgetProps> = ({ endDate }) => (
  <div data-test-id="eto-whitelist-count-down">
    <Counter endDate={endDate} />
    <div className={styles.zone}>
      <time dateTime={endDate.toISOString()}>
        {`${moment.utc(endDate).format("ddd, MMM Do YYYY, HH:mm")} UTC`}
      </time>
    </div>
  </div>
);

export { CounterWidget };
