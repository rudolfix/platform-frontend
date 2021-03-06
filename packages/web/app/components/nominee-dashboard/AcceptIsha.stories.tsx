import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { AcceptISHALayout } from "./AcceptIsha";

storiesOf("AcceptIsha", module).add("default", () => (
  <AcceptISHALayout
    deadlineTimestamp={123456789}
    companyName={"SupaCompanyLtd"}
    sign={action("sign")}
  />
));
