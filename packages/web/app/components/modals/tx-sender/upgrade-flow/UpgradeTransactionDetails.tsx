import { Eth } from "@neufund/design-system";
import { multiplyBigNumbers } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxType } from "../../../../lib/web3/types";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

const UpgradeTransactionDetails: TransactionDetailsComponent<ETxType.UPGRADE> = ({
  txData,
  className,
  txTimestamp,
}) => (
  <InfoList className={className}>
    <InfoRow caption={<FormattedMessage id="upgrade-flow.to" />} value={txData!.to} />

    <InfoRow
      caption={<FormattedMessage id="upgrade-flow.value" />}
      value={<Eth value={txData!.value} />}
    />

    <InfoRow
      caption={<FormattedMessage id="upgrade-flow.transaction-cost" />}
      value={<Eth value={multiplyBigNumbers([txData!.gasPrice, txData!.gas])} />}
    />

    {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
  </InfoList>
);

export { UpgradeTransactionDetails };
