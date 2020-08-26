import { Eur } from "@neufund/design-system";
import { ETxType } from "@neufund/shared-modules";
import { ENumberInputFormat } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { BankNumber } from "../../../wallet/bank-account/BankAccount";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";
import { CalculatedFee } from "./CalculatedFee";
import { TotalRedeemed } from "./TotalRedeemed";

const BankTransferRedeemDetails: TransactionDetailsComponent<ETxType.NEUR_REDEEM> = ({
  additionalData,
  className,
  txTimestamp,
}) => (
  <InfoList className={className}>
    <InfoRow
      caption={<FormattedMessage id="bank-transfer.redeem.summary.to-bank-account" />}
      value={
        <BankNumber
          last4={additionalData.bankAccount.accountNumberLast4}
          bank={additionalData.bankAccount.bankName}
        />
      }
    />
    <InfoRow
      caption={<FormattedMessage id="bank-transfer.redeem.summary.return-amount" />}
      value={
        <Eur
          inputFormat={ENumberInputFormat.DECIMAL}
          value={additionalData.amount}
          data-test-id={"bank-transfer.redeem-summary.return-amount"}
        />
      }
    />
    <InfoRow
      caption={<FormattedMessage id="bank-transfer.redeem.summary.bank-fee" />}
      value={<CalculatedFee bankFee={additionalData.bankFee} amount={additionalData.amount} />}
    />
    <InfoRow
      caption={<FormattedMessage id="bank-transfer.redeem.summary.total-return-amount" />}
      value={<TotalRedeemed bankFee={additionalData.bankFee} amount={additionalData.amount} />}
    />

    {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
  </InfoList>
);

export { BankTransferRedeemDetails };
