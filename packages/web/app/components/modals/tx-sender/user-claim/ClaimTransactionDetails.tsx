import { Eth, Neu } from "@neufund/design-system";
import { ETxType } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

const ClaimTransactionDetails: TransactionDetailsComponent<ETxType.USER_CLAIM> = ({
  txTimestamp,
  additionalData,
  className,
  children,
}) => (
  <InfoList className={className}>
    <InfoRow
      caption={<FormattedMessage id="user-claim-flow.token-name" />}
      value={additionalData.tokenName}
    />

    <InfoRow
      caption={<FormattedMessage id="user-claim-flow.balance" />}
      value={additionalData.tokenQuantity}
    />

    <InfoRow
      caption={<FormattedMessage id="user-claim-flow.estimated-reward" />}
      value={<Neu value={additionalData.neuRewardUlps} />}
    />

    <InfoRow
      caption={<FormattedMessage id="upgrade-flow.transaction-cost" />}
      value={<Eth value={additionalData.costUlps} />}
    />

    {children}

    {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
  </InfoList>
);

export { ClaimTransactionDetails };
