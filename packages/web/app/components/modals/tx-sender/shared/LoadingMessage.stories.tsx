import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { LoadingMessage } from "./LoadingMessage";

storiesOf("LoadingMessage", module)
  .addDecorator(withModalBody())
  .add("default", () => <LoadingMessage />);
