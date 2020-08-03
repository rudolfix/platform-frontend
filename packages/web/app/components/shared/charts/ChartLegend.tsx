import { Percentage } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { OTHERS_NAME } from "../../eto/utils";

import * as styles from "./ChartLegend.module.scss";

interface IDataset {
  data: number[];
  backgroundColor: string[];
}

interface IData {
  datasets: IDataset[];
  labels: string[];
}

interface IProps {
  data: IData;
}

export const ChartLegend: React.FunctionComponent<IProps> = ({ data }) => (
  <>
    {data.datasets.map(dataset =>
      dataset.data.map((value, index) => (
        <div className={styles.chartLegend} key={data.labels[index]}>
          <div
            className={styles.indicator}
            style={{ backgroundColor: dataset.backgroundColor[index] }}
          />
          <div>
            {data.labels[index] === OTHERS_NAME ? (
              <FormattedMessage id="shared.chart-doughnut.others" />
            ) : (
              data.labels[index]
            )}{" "}
            <Percentage value={value.toString()} />
          </div>
        </div>
      )),
    )}
  </>
);
