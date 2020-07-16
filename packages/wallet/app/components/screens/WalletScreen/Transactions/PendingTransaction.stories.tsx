import {
  ECurrency,
  ENumberInputFormat,
  toEthereumChecksumAddress,
  toEthereumTxHash,
} from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";

import {
  ETransactionDirection,
  ETransactionStatus,
  ETransactionType,
  TTxHistory,
} from "modules/wallet-screen/module";

import { PendingTransaction } from "./PendingTransaction";

const transaction: TTxHistory = {
  amount: "29083350986799034000",
  amountFormat: ENumberInputFormat.ULPS,
  blockNumber: 8,
  date: "2019-08-07T06:58:48.736923+00:00",
  id: "8_0_0",
  logIndex: 0,
  transactionDirection: ETransactionDirection.OUT,
  transactionIndex: 0,
  txHash: toEthereumTxHash("0xea3145cf6334a8fe5a9570c05fef7ebb2b3c728369fccae5cf8f30809d99be94"),
  settledAmount: "29083350986799030000",
  subType: ETransactionStatus.COMPLETED,
  type: ETransactionType.NEUR_REDEEM,
  currency: ECurrency.EUR_TOKEN,
  reference: "XNKAPOMXNOAS",
  fromAddress: toEthereumChecksumAddress("0xfA1Af2E251ee739F83e14d7daCfd77B3d0E930b7"),
  feeAmount: "4000",
};

storiesOf("Molecules|PendingTransaction", module)
  .add("direction: out", () => (
    <PendingTransaction transaction={transaction} onPress={action("onPress")} />
  ))
  .add("direction: in", () => (
    <PendingTransaction
      transaction={{ ...transaction, transactionDirection: ETransactionDirection.IN }}
      onPress={action("onPress")}
    />
  ));
