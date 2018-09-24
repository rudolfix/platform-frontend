import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Tag } from "./Tag";

storiesOf("Basic UI/Tag", module)
  .add("default", () => <Tag text={"lorem"} />)
  .add("themed", () => (
    <>
      <Tag text={"dark theme"} theme="dark" />
      <Tag text={"green theme"} theme="green" />
      <Tag text={"silver theme"} theme="silver" />
      <Tag to="#0" text="tag" />
      <Tag layout="ghost" to="#0" text="ghost tag" />
      <Tag layout="ghost" size="small" to="#0" text="small ghost tag" />
      <Tag theme="green" layout="ghost" size="small" to="#0" text="Small green ghost tag" />
      <Tag theme="dark" size="small" to="#0" text="Small dark tag" />
    </>
  ));
