import { storiesOf } from "@storybook/react";
import * as React from "react";

import { SectionHeader } from "./SectionHeader";

storiesOf("SectionHeader", module)
  .add("layout: has decorator", () => <SectionHeader>Lorem Ipsum</SectionHeader>)
  .add("layout: without decorator", () => <SectionHeader layoutHasDecorator={false}>Lorem Ipsum</SectionHeader>)
