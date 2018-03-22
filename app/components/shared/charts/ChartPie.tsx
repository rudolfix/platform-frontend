import * as React from "react";
import { Pie } from "react-chartjs-2";

interface IDataset {
  data: number[];
  backgroundColor: string[];
}

interface IData {
  datasets: IDataset[];
}

interface IProps {
  data: IData;
}

export const ChartPie: React.SFC<IProps> = ({ data }) => {
  return <Pie data={data} height={100} width={100} legend={{ position: "right" }} />;
};
