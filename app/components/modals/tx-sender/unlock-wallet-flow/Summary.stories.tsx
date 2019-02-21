import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { UnlockFundsSummaryComponent } from "./Summary";

storiesOf("Upgrade Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <UnlockFundsSummaryComponent
      txCost={"123456"}
      onAccept={() => {}}
      neumarksDue="123"
      etherLockedBalance="1234"
    />
  ));
