import { call } from "redux-saga/effects";

import { EInvestmentErrorMessage } from "../../../../../components/translatedMessages/messages";
import { createMessage, TMessage } from "../../../../../components/translatedMessages/utils";
import { InvariantError } from "../../../../../utils/invariant";
import { convertToUlps } from "../../../../../utils/NumberUtils";
import { EValidationState } from "../../../validator/reducer";
import {
  EInputValidationError,
  EInvestmentErrorState,
  EInvestmentFormState,
  TValidationError,
} from "../types";
import { computeCurrencies } from "./computeCurrencies";
import { getEuroTicketSizes } from "./getEuroTicketSizes";
import { reinitInvestmentView } from "./reinitInvestmentView";

export function* populateInvalidViewData(
  investmentValue: string,
  error: TValidationError,
): Generator<any, any, any> {
  const formData = yield call(reinitInvestmentView);

  const { eto, investmentType, investmentCurrency, minTicketEur, minTicketEth } = formData;

  let errorMessage: TMessage;

  switch (error) {
    case EInputValidationError.NOT_A_NUMBER:
      errorMessage = yield call(createMessage, EInvestmentErrorMessage.NOT_A_NUMBER);
      break;
    case EInvestmentErrorState.AboveMaximumTicketSize:
      const { euroValueUlps } = yield call(
        computeCurrencies,
        convertToUlps(investmentValue),
        investmentCurrency,
      );
      const { maxTicketEur } = yield call(getEuroTicketSizes, {
        eto,
        euroValueUlps,
        investmentType,
      });
      errorMessage = yield call(createMessage, EInvestmentErrorMessage.ABOVE_MAXIMUM_TICKET_SIZE, {
        value: maxTicketEur,
      });
      break;
    case EInvestmentErrorState.BelowMinimumTicketSize:
      errorMessage = yield call(createMessage, EInvestmentErrorMessage.BELOW_MINIMUM_TICKET_SIZE, {
        investmentCurrency: investmentCurrency,
        minTicketEur: minTicketEur,
        minTicketEth: minTicketEth,
      });
      break;
    case EInvestmentErrorState.ExceedsTokenAmount:
      errorMessage = yield call(createMessage, EInvestmentErrorMessage.EXCEEDS_TOKEN_AMOUNT, {
        tokenName: formData.eto.equityTokenName,
      });
      break;
    case EInvestmentErrorState.ExceedsWalletBalance:
      errorMessage = yield call(createMessage, EInvestmentErrorMessage.EXCEEDS_WALLET_BALANCE);
      break;
    case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS:
      errorMessage = yield call(createMessage, EInvestmentErrorMessage.NOT_ENOUGH_ETHER_FOR_GAS);
      break;
    default:
      throw new InvariantError("mapErrorsToMessages received an unexpected message variant");
  }

  return {
    ...formData,
    investmentValue,
    formState: EInvestmentFormState.INVALID,
    error: errorMessage,
  };
}
