import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { EtoProjectState } from "./EtoProjectState";

storiesOf("EtoProjectState", module).add("pending", () => (
  <EtoProjectState status={EtoState.PENDING} />
));
