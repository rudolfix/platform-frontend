import { Eth, Eur } from "@neufund/design-system";
import {
  assertNever,
  divideBigNumbers,
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  selectDecimalPlaces,
  toFixedPrecision,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import includes from "lodash/fp/includes";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TBigNumberVariants } from "../../../../lib/web3/types";
import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import { EValidationState } from "../../../../modules/tx/validator/reducer";
import { TTranslatedString } from "../../../../types";

export enum EInvestmentCurrency {
  ETH = ECurrency.ETH,
  EUR_TOKEN = ECurrency.EUR_TOKEN,
}

export const getInvestmentCurrency = (investmentType: EInvestmentType) => {
  switch (investmentType) {
    case EInvestmentType.Eth:
    case EInvestmentType.ICBMEth:
      return EInvestmentCurrency.ETH;
    case EInvestmentType.NEur:
    case EInvestmentType.ICBMnEuro:
      return EInvestmentCurrency.EUR_TOKEN;
    default:
      return assertNever(investmentType);
  }
};

export function isICBMWallet(type: EInvestmentType): boolean {
  return includes(type, [EInvestmentType.ICBMnEuro, EInvestmentType.ICBMEth]);
}

export function getInputErrorMessage(
  investmentTxErrorState: EInvestmentErrorState | undefined,
  txValidationState: EValidationState | undefined,
  tokenName: string,
  maxTicketEur: string,
  minTicketEur: string,
  minTicketEth: string,
  investmentCurrency: EInvestmentCurrency,
): TTranslatedString | undefined {
  switch (investmentTxErrorState) {
    case EInvestmentErrorState.ExceedsTokenAmount:
      return (
        <FormattedMessage
          id="investment-flow.error-message.exceeds-token-amount"
          values={{ tokenName }}
        />
      );
    case EInvestmentErrorState.AboveMaximumTicketSize:
      return (
        <FormattedMessage
          id="investment-flow.error-message.above-maximum-ticket-size"
          values={{
            maxEurAmount: (
              <Eur
                value={maxTicketEur || "0"}
                inputFormat={ENumberInputFormat.DECIMAL}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              />
            ),
          }}
        />
      );
    case EInvestmentErrorState.BelowMinimumTicketSize:
      return (
        <FormattedMessage
          id="investment-flow.error-message.below-minimum-ticket-size"
          values={{
            investmentCurrency,
            minEurAmount: (
              <Eur
                value={minTicketEur || "0"}
                inputFormat={ENumberInputFormat.DECIMAL}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              />
            ),
            minEthAmount: <Eth value={minTicketEth || "0"} />,
          }}
        />
      );

    case EInvestmentErrorState.ExceedsWalletBalance:
      return <FormattedMessage id="investment-flow.error-message.exceeds-wallet-balance" />;
  }

  switch (txValidationState) {
    case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS:
      return <FormattedMessage id="modal.txsender.error-message.not-enough-ether-for-gas" />;
  }

  return undefined;
}

export const formatMinMaxTickets = (value: TBigNumberVariants, roundingMode: ERoundingMode) =>
  toFixedPrecision({
    value,
    inputFormat: ENumberInputFormat.ULPS,
    outputFormat: ENumberOutputFormat.FULL,
    decimalPlaces: selectDecimalPlaces(ECurrency.EUR, ENumberOutputFormat.FULL),
    roundingMode: roundingMode,
  });

export const getActualTokenPriceEur = (
  investmentEur: string,
  equityTokenCount: string | number,
): string => divideBigNumbers(investmentEur, equityTokenCount.toString()).toString();

export const getTokenPriceDiscount = (fullTokenPrice: string, actualTokenPrice: string) => {
  // round up effective discount
  const discount = new BigNumber("1")
    .sub(new BigNumber(actualTokenPrice).div(new BigNumber(fullTokenPrice)))
    .mul("100")
    .round(0, BigNumber.ROUND_HALF_UP);

  return discount.gte("1") ? discount.toString() : null;
};
