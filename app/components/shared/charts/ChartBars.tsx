import * as React from "react";
import { Bar } from "react-chartjs-2";
import * as styles from "./ChartBars.module.scss";
import { ChartLegned } from "./ChartLegned";

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

export const ChartBars: React.SFC<IProps> = ({ data }) => {
  return (
    <div className={styles.chartBars}>
      <div className={styles.chartWrapper}>
        <Bar
          data={data}
          width={388}
          height={244}
          legend={{ display: false }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [
                {
                  display: false,
                  gridLines: {
                    display: false,
                  },
                },
              ],
            },
          }}
        />
      </div>
      <div className={styles.legendWrapper}>
        <ChartLegned data={data} />
      </div>
    </div>
  );
};
