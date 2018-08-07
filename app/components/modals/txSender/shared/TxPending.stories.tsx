import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import { ITxPendingProps, TxPending } from "./TxPending";

const txData: ITxPendingProps = {
  blockId: 4623487932,
  txHash: "af908098b968d7564564362c51836",
};

storiesOf("TxPending", module).add("default", () => (
  <Container>
    <TxPending {...txData} />
  </Container>
));
