import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ButtonArrowLeft, ButtonArrowRight, ButtonClose } from "./CommonButtons";

storiesOf("NDS|Atoms/Button", module)
  .add("ButtonClose", () => (
    <ButtonClose onClick={action("onClick")} iconProps={{ alt: "Close" }} />
  ))
  .add("ButtonArrowRight", () => <ButtonArrowRight>Arrow Right</ButtonArrowRight>)
  .add("ButtonArrowLeft", () => <ButtonArrowLeft>Arrow Left</ButtonArrowLeft>);
