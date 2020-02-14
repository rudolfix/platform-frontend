import { storiesOf } from "@storybook/react";
import * as React from "react";

import { DataRow, DataRowSeparated, DataRowSeparator } from "./DataRow";

storiesOf("DataRow", module)
  .add("default", () => (
    <>
      <DataRow caption="Caption" value="Value" />
      <DataRow caption="Caption" value="Value" />
      <DataRowSeparator />
      <DataRow caption="Caption" value="Value" />
    </>
  ))
  .add("Separated", () => (
    <>
      <DataRowSeparated caption="Caption" value="Value" />
      <DataRowSeparated caption="Caption" value="Value" />
      <DataRowSeparated caption="Caption" value="Value" />
    </>
  ));
