import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../../test/fixtures";
import { TokenholdersWidgetLayout } from "./TokenholdersWidget";

storiesOf("ETO-Flow/TokenholdersWidget", module).add("default", () => (
  <TokenholdersWidgetLayout
    eto={testEto}
    downloadTokenholdersList={action("downloadTokenholdersList")}
  />
));
