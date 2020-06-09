import { storiesOf } from "@storybook/react";
import * as React from "react";

import { DataRow, DataRowSeparated, DataRowSeparator, EDataRowSize } from "./DataRow";

storiesOf("DataRow", module)
  .add("default (normal size)", () => (
    <>
      <DataRow caption="Caption" value="Value" />
      <DataRow caption="Caption" value="Value" />
      <DataRowSeparator />
      <DataRow caption="Caption" value="Value" />
    </>
  ))
  .add("small size", () => (
    <>
      <DataRow size={EDataRowSize.SMALL} caption="Caption" value="Value" />
      <DataRow size={EDataRowSize.SMALL} caption="Caption" value="Value" />
      <DataRowSeparator />
      <DataRow size={EDataRowSize.SMALL} caption="Caption" value="Value" />
    </>
  ))
  .add("Separated", () => (
    <>
      <DataRowSeparated caption="Caption" value="Value" />
      <DataRowSeparated caption="Caption" value="Value" />
      <DataRowSeparated caption="Caption" value="Value" />
    </>
  ));
