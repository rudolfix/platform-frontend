import { TEtoWithCompanyAndContractReadonly } from "@neufund/shared-modules";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoWidget } from "./EtoWidgetView";

storiesOf("ETO/EtoWidgetView", module).add("widget not found", () => (
  <EtoWidget
    widgetError={true}
    eto={{ previewCode: "error" } as TEtoWithCompanyAndContractReadonly}
  />
));
