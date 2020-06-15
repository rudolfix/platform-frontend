import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EWarningAlertSize, WarningAlert } from "./WarningAlert";

storiesOf("Atoms/WarningAlert", module)
  .add("default", () => <WarningAlert>Alert message</WarningAlert>)
  .add("big", () => <WarningAlert size={EWarningAlertSize.BIG}>Alert message</WarningAlert>);
