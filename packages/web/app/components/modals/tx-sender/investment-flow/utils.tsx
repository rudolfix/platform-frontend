import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import {
  EInvestmentCurrency,
  EInvestmentErrorState,
} from "../../../../modules/tx/user-flow/investment/reducer";
import { EValidationState } from "../../../../modules/tx/validator/reducer";
import { TTranslatedString } from "../../../../types";
import { divideBigNumbers } from "../../../../utils/BigNumberUtils";
import { Money } from "../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  EPriceFormat,
  formatNumber,
  selectDecimalPlaces,
} from "../../../shared/formatters/utils";

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
              <Money
                value={maxTicketEur || "0"}
                inputFormat={ENumberInputFormat.FLOAT}
                valueType={ECurrency.EUR}
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
              <Money
                value={minTicketEur || "0"}
                inputFormat={ENumberInputFormat.FLOAT}
                valueType={ECurrency.EUR}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              />
            ),
            minEthAmount: (
              <Money
                value={minTicketEth || "0"}
                inputFormat={ENumberInputFormat.FLOAT}
                valueType={ECurrency.ETH}
                outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS_ROUND_UP}
              />
            ),
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

export function getActualTokenPriceEur(
  investmentEurUlps: string,
  equityTokenCount: string | number,
): string {
  return formatNumber({
    value: divideBigNumbers(investmentEurUlps, equityTokenCount.toString()).toString(),
    decimalPlaces: selectDecimalPlaces(EPriceFormat.EQUITY_TOKEN_PRICE_EUR_TOKEN),
  });
}

export const getTokenPriceDiscount = (fullTokenPrice: string, actualTokenPrice: string) => {
  // round up effective discount
  const discount = new BigNumber("1")
    .sub(new BigNumber(actualTokenPrice).div(new BigNumber(fullTokenPrice)))
    .mul("100")
    .round(0, BigNumber.ROUND_HALF_UP);

  return discount.gte("1") ? discount.toString() : null;
};
