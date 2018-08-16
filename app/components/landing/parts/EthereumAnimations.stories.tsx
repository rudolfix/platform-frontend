import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ConfettiEthereum } from "./ConfettiEthereum";
import { SpinningEthereum } from "./SpinningEthereum";

storiesOf("EthereumAnimations", module)
  .add("Confetti", () => <ConfettiEthereum />)
  .add("Spinning", () => <SpinningEthereum />);
