import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { HeaderFullscreen } from "./HeaderFullscreen";

storiesOf("Layout/Header FullScreen", module)
  .add("default", () => (
    <>
      <HeaderFullscreen />
    </>
  ))
  .add("with button", () => (
    <>
      <HeaderFullscreen buttonAction={action("CLOSE_ACTION")} buttonText="Close" />
    </>
  ));
