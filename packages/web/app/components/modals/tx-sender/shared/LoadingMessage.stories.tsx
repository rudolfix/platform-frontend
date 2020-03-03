import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { LoadingMessage } from "./LoadingMessage";

storiesOf("LoadingMessage", module)
  .addDecorator(withModalBody())
  .add("default", () => <LoadingMessage />);
