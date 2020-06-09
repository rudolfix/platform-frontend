import { storiesOf } from "@storybook/react";
import * as React from "react";

import { FormatBoolean } from "./FormatBoolean";

storiesOf("Atoms|FormatBoolean", module)
  .add("yes", () => <FormatBoolean value={true} />)
  .add("no", () => <FormatBoolean value={false} />);
