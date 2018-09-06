import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Panel } from "./Panel";

import * as icon from "../../assets/img/notifications/warning.svg";

const lorem =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, eveniet reiciendis minus aperiam numquam vero at placeat, officia, porro similique voluptatem dolores provident labore dolorem temporibus veniam sapiente nihil quibusdam.";

storiesOf("Basic UI/Panel", module)
  .add("default", () => <Panel>{lorem}</Panel>)
  .add("with header text", () => <Panel headerText="sample header text">{lorem}</Panel>)
  .add("with icon", () => <Panel icon={icon}>{lorem}</Panel>)
  .add("with header text and icon", () => (
    <Panel headerText="sample header text" icon={icon}>
      {lorem}
    </Panel>
  ));
