import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withStore } from "../../utils/storeDecorator";
import { Tabs } from "./Tabs";

const tabs = [
  { text: "first tab active by default", path: "/" },
  { text: "second tab", path: "/rand" },
  { text: "third tab", path: "/om" },
];

storiesOf("Tabs", module)
  .addDecorator(withStore())
  .add("default", () => <Tabs tabs={tabs} />)
  .add("theme dark", () => <Tabs theme="dark" tabs={tabs} />)
  .add("large", () => <Tabs size="large" tabs={tabs} />);
