// tslint:disable-next-line:no-implicit-dependencies
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { PanelWhite } from "./PanelWhite";

const lorem =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, eveniet reiciendis minus aperiam numquam vero at placeat, officia, porro similique voluptatem dolores provident labore dolorem temporibus veniam sapiente nihil quibusdam.";

storiesOf("Panel White", module).add("default", () => <PanelWhite>{lorem}</PanelWhite>);
