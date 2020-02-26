import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EWarningAlertLayout, EWarningAlertSize, WarningAlert } from "./WarningAlert";

storiesOf("Core|Atoms/WarningAlert", module)
  .add("default", () => <WarningAlert>Alert message</WarningAlert>)
  .add("big", () => <WarningAlert size={EWarningAlertSize.BIG}>Alert message</WarningAlert>)
  .add("inline", () => (
    <WarningAlert layout={EWarningAlertLayout.INLINE}>Alert message</WarningAlert>
  ))
  .add("big inline", () => (
    <WarningAlert size={EWarningAlertSize.BIG} layout={EWarningAlertLayout.INLINE}>
      Alert message
    </WarningAlert>
  ));
