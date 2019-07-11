import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETransactionDirection, ETransactionType } from "../../../lib/api/analytics-api/interfaces";
import { TTxHistory } from "../../../modules/tx-history/types";
import { assertNever } from "../../../utils/assertNever";
import { selectUnits } from "../../shared/formatters/utils";

type TExternalProps = { transaction: TTxHistory };

const TransactionName: React.FunctionComponent<TExternalProps> = ({ transaction }) => {
  switch (transaction.type) {
    case ETransactionType.TRANSFER:
      return transaction.transactionDirection === ETransactionDirection.IN ? (
        <FormattedMessage
          id="wallet.tx-list.name.transfer.received"
          values={{ currency: selectUnits(transaction.currency) }}
        />
      ) : (
        <FormattedMessage
          id="wallet.tx-list.name.transfer.transferred"
          values={{ currency: selectUnits(transaction.currency) }}
        />
      );
    case ETransactionType.ETO_INVESTMENT:
      return (
        <FormattedMessage
          id="wallet.tx-list.name.eto-investment"
          values={{ companyName: transaction.companyName }}
        />
      );
    case ETransactionType.ETO_REFUND:
      return (
        <FormattedMessage
          id="wallet.tx-list.name.eto-refund"
          values={{ companyName: transaction.companyName }}
        />
      );
    case ETransactionType.NEUR_PURCHASE:
      return (
        <FormattedMessage
          id="wallet.tx-list.name.neur-purchase"
          values={{ currency: selectUnits(transaction.currency) }}
        />
      );
    case ETransactionType.NEUR_REDEEM:
      return (
        <FormattedMessage
          id="wallet.tx-list.name.neur-redeem"
          values={{ currency: selectUnits(transaction.currency) }}
        />
      );
    case ETransactionType.NEUR_DESTROY:
      return (
        <FormattedMessage
          id="wallet.tx-list.name.neur-destroy"
          values={{ currency: selectUnits(transaction.currency) }}
        />
      );
    case ETransactionType.ETO_TOKENS_CLAIM:
      return (
        <FormattedMessage
          id="wallet.tx-list.name.eto-tokens-claim"
          values={{ currency: selectUnits(transaction.currency) }}
        />
      );
    case ETransactionType.REDISTRIBUTE_PAYOUT:
      return (
        <FormattedMessage
          id="wallet.tx-list.name.redistribute-payout"
          values={{ currency: selectUnits(transaction.currency) }}
        />
      );
    case ETransactionType.PAYOUT:
      return (
        <FormattedMessage
          id="wallet.tx-list.name.payout"
          values={{ currency: selectUnits(transaction.currency) }}
        />
      );
    default:
      return assertNever(transaction, "Unsupported transaction type");
  }
};

export { TransactionName };
