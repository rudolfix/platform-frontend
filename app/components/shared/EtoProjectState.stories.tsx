import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoProjectState } from "./EtoProjectStatus";

storiesOf("EtoProjectState", module)
  .add("campaigning", () => <EtoProjectState status="campaigning" />)
  .add("pre-eto", () => <EtoProjectState status="pre-eto" />)
  .add("public-eto", () => <EtoProjectState status="public-eto" />)
  .add("in-signing", () => <EtoProjectState status="in-signing" />)
  .add("claim", () => <EtoProjectState status="claim" />)
  .add("refund", () => <EtoProjectState status="refund" />);
