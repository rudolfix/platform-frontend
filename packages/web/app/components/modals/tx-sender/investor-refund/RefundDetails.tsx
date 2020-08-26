import { Eth, Eur, EurToken } from "@neufund/design-system";
import { ETxType } from "@neufund/shared-modules";
import { isZero } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

const RefundTransactionDetails: TransactionDetailsComponent<ETxType.INVESTOR_REFUND> = ({
  txTimestamp,
  additionalData,
  className,
}) => (
  <InfoList className={className}>
    <InfoRow
      caption={<FormattedMessage id="user-refund-flow.token-name" />}
      value={`${additionalData.tokenName} (${additionalData.tokenSymbol})`}
    />

    {!isZero(additionalData.amountEurUlps) && (
      <InfoRow
        caption={<FormattedMessage id="user-refund-flow.amount.neur" />}
        value={
          <EurToken
            data-test-id="modals.tx-sender.user-refund-flow.amount.neur"
            value={additionalData.amountEurUlps}
          />
        }
      />
    )}

    {!isZero(additionalData.amountEth) && (
      <InfoRow
        caption={<FormattedMessage id="user-refund-flow.amount.eth" />}
        value={
          <Eth
            data-test-id="modals.tx-sender.user-refund-flow.amount.eth"
            value={additionalData.amountEth}
          />
        }
      />
    )}

    {/* Show only when transaction is not signed yet */}
    {!txTimestamp && (
      <InfoRow
        caption={<FormattedMessage id="user-refund-flow.cost" />}
        value={
          <>
            <Eur value={additionalData.costEur} />
            {" ≈ "}
            <Eth value={additionalData.costUlps} />
          </>
        }
      />
    )}
    {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
  </InfoList>
);

export { RefundTransactionDetails };
