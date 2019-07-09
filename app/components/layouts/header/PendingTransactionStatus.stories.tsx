import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ETxSenderState } from "../../../modules/tx/sender/reducer";
import { PendingTransactionStatus } from "./PendingTransactionStatus";

storiesOf("PendingTransactionStatus", module)
  .add("No pending transactions", () => (
    <PendingTransactionStatus
      className="className"
      pendingTransaction={undefined}
      monitorPendingTransaction={action("monitorPendingTransaction")}
    />
  ))
  .add("In progress", () => (
    <PendingTransactionStatus
      className="className"
      pendingTransaction={{
        transactionStatus: ETxSenderState.MINING,
      }}
      monitorPendingTransaction={action("monitorPendingTransaction")}
    />
  ))
  .add("Success", () => (
    <PendingTransactionStatus
      className="className"
      pendingTransaction={{
        transactionStatus: ETxSenderState.DONE,
      }}
      monitorPendingTransaction={action("monitorPendingTransaction")}
    />
  ))
  .add("Error", () => (
    <PendingTransactionStatus
      className="className"
      pendingTransaction={{
        transactionStatus: ETxSenderState.ERROR_SIGN,
      }}
      monitorPendingTransaction={action("monitorPendingTransaction")}
    />
  ));
