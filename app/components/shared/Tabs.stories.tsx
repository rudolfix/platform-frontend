// tslint:disable-next-line:no-implicit-dependencies
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Tabs } from "./Tabs";

const tabs = [
  { text: "tab 1", path: "/demo" },
  { text: "tab 2", path: "/demo1" },
  { text: "tab 3", path: "/demo2" },
];

// storiesOf("Tabs", module).add("default", () => <Tabs tabs={tabs} />);
// .add("themed", () => ())
