import * as React from "react";
import { Pie } from "react-chartjs-2";
import { ChartLegned } from "./ChartLegned";
import * as styles from "./ChartPie.module.scss";

interface IDataset {
  data: number[];
  backgroundColor: string[];
}

export interface IChartPieData {
  datasets: IDataset[];
  labels: string[];
}

interface IProps {
  data: IChartPieData;
}

export const ChartPie: React.SFC<IProps> = ({ data }) => {
  return (
    <div className={styles.chartPie}>
      <div className={styles.chartWrapper}>
        <Pie data={data} height={100} width={100} legend={{ display: false }} />
      </div>
      <div className={styles.legendWrapper}>
        <ChartLegned data={data} />
      </div>
    </div>
  );
};
