import * as cn from "classnames";
import * as React from "react";
import { Doughnut } from "react-chartjs-2";
import { ChartLegned } from "./ChartLegned";

import * as styles from "./ChartDoughnut.module.scss";

type TLayout = "vertical";

interface IProps {
  data: any;
  className?: string;
  layout?: TLayout;
}

export const ChartDoughnut: React.SFC<IProps> = ({ data, layout, className }) => {
  return (
    <div className={cn(styles.chartDoughnut, className, layout || "")}>
      <div className={styles.chartWrapper}>
        <Doughnut data={data} legend={{ display: false }} height={100} width={100} />
      </div>
      <div className={styles.legendWrapper}>
        <ChartLegned data={data} />
      </div>
    </div>
  );
};
