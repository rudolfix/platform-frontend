import * as React from "react";

import { EthereumIcon } from "../../../shared/ethereum";
import { Message } from "../../message/Message";

const LoadingMessage = () => (
  <Message data-test-id="modals.shared.signing-message.modal" image={<EthereumIcon />} />
);

export { LoadingMessage };
