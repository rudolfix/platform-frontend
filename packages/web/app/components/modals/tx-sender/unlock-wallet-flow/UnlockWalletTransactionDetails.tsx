import { Eth, EurToken, Neu } from "@neufund/design-system";
import { walletApi } from "@neufund/shared-modules";
import {
  ECurrency,
  getCurrentUTCTimestamp,
  multiplyBigNumbers,
  PLATFORM_UNLOCK_FEE,
  PLATFORM_ZERO_FEE,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, lifecycle, withState } from "recompose";

import { ETxType } from "../../../../lib/web3/types";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

export type TTxPendingProps = React.ComponentProps<
  TransactionDetailsComponent<ETxType.UNLOCK_FUNDS>
>;

interface IAdditionalProps {
  returnedAmount: BigNumber;
  unlockFee: number;
  updateReturnedFunds: (returnedAmount: BigNumber) => void;
  updateUnlockFee: (unlockFee: number) => void;
}

const UnlockWalletTransactionDetailsLayout: React.FunctionComponent<TTxPendingProps &
  IAdditionalProps> = ({
  txData,
  additionalData,
  returnedAmount,
  className,
  txTimestamp,
  unlockFee,
}) => (
  <InfoList className={className}>
    <InfoRow
      caption={<FormattedMessage id="unlock-funds-flow.eth-committed" />}
      value={
        additionalData.currencyType === ECurrency.ETH ? (
          <Eth value={additionalData.lockedWalletBalance} />
        ) : (
          <EurToken value={additionalData.lockedWalletBalance} />
        )
      }
    />
    <InfoRow
      caption={<FormattedMessage id="unlock-funds-flow.neumarks-due" />}
      value={<Neu value={additionalData.neumarksDue} />}
    />
    <InfoRow
      caption={
        <FormattedMessage
          id="unlock-funds-flow.fee"
          values={{
            fee: unlockFee,
          }}
        />
      }
      value={null}
    />
    <InfoRow
      caption={<FormattedMessage id="unlock-funds-flow.amount-returned" />}
      value={
        additionalData.currencyType === ECurrency.ETH ? (
          <Eth value={returnedAmount} />
        ) : (
          <EurToken value={returnedAmount} />
        )
      }
    />
    <InfoRow
      caption={<FormattedMessage id="unlock-funds-flow.transaction-cost" />}
      value={<Eth value={multiplyBigNumbers([txData!.gasPrice, txData!.gas])} />}
    />

    {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
  </InfoList>
);

const UnlockWalletTransactionDetails = compose<
  TTxPendingProps & IAdditionalProps,
  React.ComponentProps<TransactionDetailsComponent<ETxType.UNLOCK_FUNDS>>
>(
  withState("returnedAmount", "updateReturnedFunds", 0),
  withState("unlockFee", "updateUnlockFee", PLATFORM_UNLOCK_FEE * 100),
  lifecycle<TTxPendingProps & IAdditionalProps, {}>({
    componentDidMount(): void {
      const { updateReturnedFunds, additionalData, updateUnlockFee } = this.props;
      const { lockedWalletUnlockDate, lockedWalletBalance } = additionalData;
      setInterval(() => {
        const amountAfterFee = walletApi.utils.getUnlockedWalletEtherAmountAfterFee(
          new BigNumber(lockedWalletBalance),
          // TODO: Remove with https://github.com/Neufund/platform-frontend/issues/2156
          lockedWalletUnlockDate,
          getCurrentUTCTimestamp(),
        );
        if (amountAfterFee.toString() === lockedWalletBalance) {
          updateUnlockFee(PLATFORM_ZERO_FEE);
        }
        updateReturnedFunds(amountAfterFee);
      }, 1000);
    },
  }),
)(UnlockWalletTransactionDetailsLayout);

export { UnlockWalletTransactionDetails };
