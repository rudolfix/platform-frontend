import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoProjectState } from "./EtoProjectStatus";

storiesOf("EtoProjectState", module).add("pending", () => <EtoProjectState status="pending" />);
