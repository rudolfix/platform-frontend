import * as React from "react";

const ChartDoughnutLazy = React.lazy(() =>
  import("./ChartDoughnut.unsafe").then(imp => ({ default: imp.ChartDoughnut })),
);

export { ChartDoughnutLazy };
