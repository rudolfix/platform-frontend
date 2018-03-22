import * as React from "react";
import { Doughnut } from "react-chartjs-2";

export const ChartDoughnut: React.SFC<any> = ({ data }) => {
  return <Doughnut data={data} legend={{ display: false }} height={100} width={100} />;
};
