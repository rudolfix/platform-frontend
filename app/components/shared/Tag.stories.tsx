// tslint:disable-next-line:no-implicit-dependencies
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Tag } from "./Tag";

storiesOf("Tag", module)
  .add("default", () => <Tag text={"lorem"} />)
  .add("themed", () => (
    <>
      <Tag text={"dark theme"} theme="dark" />
      <Tag text={"green theme"} theme="green" />
    </>
  ));
