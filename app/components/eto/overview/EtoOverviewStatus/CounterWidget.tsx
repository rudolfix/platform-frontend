import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Counter } from "../../../shared/Counter";

import * as styles from "./CounterWidget.module.scss";

export interface ICounterWidgetProps {
  endDate?: number;
  stage?: string;
}

const CounterWidget: React.SFC<ICounterWidgetProps> = ({ endDate, stage }) => {
  return (
    <div className={styles.counterWidget}>
      <div className={styles.title}>
        <FormattedMessage id="shared-component.eto-overview.count-down-to" values={{ stage }} />
      </div>
      {endDate && (
        <>
          <div className={styles.zone}>{new Date(endDate).toUTCString()}</div>
          <Counter endDate={endDate} />
        </>
      )}
    </div>
  );
};

export { CounterWidget };
