import { Eth, Eur } from "@neufund/design-system";
import { ETxType } from "@neufund/shared-modules";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  selectUnits,
} from "@neufund/shared-utils";
import cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Money } from "../../../shared/formatters/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

import * as styles from "./AcceptSummary.module.scss";

const AcceptTransactionDetails: TransactionDetailsComponent<ETxType.INVESTOR_ACCEPT_PAYOUT> = ({
  additionalData,
  txTimestamp,
}) => (
  <InfoList className={styles.payoutList}>
    {additionalData.tokensDisbursals.map(disbursal => (
      <InfoRow
        key={disbursal.token}
        caption={
          <FormattedMessage
            id="investor-payout.accept.summary.total-payout"
            values={{ token: selectUnits(disbursal.token) }}
          />
        }
        value={
          <div className={styles.value}>
            <Money
              data-test-id={`investor-payout.accept-summary.${disbursal.token}-total-payout`}
              value={disbursal.amountToBeClaimed}
              valueType={disbursal.token}
              inputFormat={ENumberInputFormat.ULPS}
              outputFormat={ENumberOutputFormat.FULL}
            />
            <span>
              {disbursal.token !== ECurrency.EUR && disbursal.token !== ECurrency.EUR_TOKEN
                ? " ≈"
                : " "}
              <Eur value={disbursal.amountEquivEur} />
            </span>
          </div>
        }
      />
    ))}
    <InfoRow
      data-test-id="investor-payout.accept-summary.transaction-cost"
      caption={<FormattedMessage id="investor-payout.accept.summary.less-gas-cost" />}
      value={
        <div className={styles.value}>
          <Eth value={additionalData.gasCostEth} />
          <span>
            {" ≈"}
            <Eur value={additionalData.gasCostEuro} />
          </span>
        </div>
      }
    />
    <InfoRow
      className={styles.totalPayout}
      data-test-id="investor-payout.accept-summary.total-payout"
      caption={<FormattedMessage id="investor-payout.accept.summary.total-net-payout" />}
      value={
        <span
          className={cn({ [styles.totalPayoutNegative]: additionalData.payoutLowerThanMinimum })}
        >
          {" ≈"}
          <Eur value={additionalData.totalPayoutEuro} />
        </span>
      }
    />
    {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
  </InfoList>
);

export { AcceptTransactionDetails };
