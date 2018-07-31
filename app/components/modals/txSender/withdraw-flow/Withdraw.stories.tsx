import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Withdraw } from "./Withdraw";

storiesOf("Withdraw", module).add("default", () => <Withdraw onAccept={() => {}} />);
