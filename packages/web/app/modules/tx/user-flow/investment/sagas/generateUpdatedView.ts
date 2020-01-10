import { call } from "@neufund/sagas";

import { EValidationState } from "../../../validator/reducer";
import {
  EInputValidationError,
  EInvestmentErrorState,
  EInvestmentValueType,
  TInvestmentValidationResult,
} from "../types";
import { calculateInvestmentCostsData } from "./calculateInvestmentCostsData";
import { populateInvalidViewData } from "./populateInvalidViewData";
import { reinitInvestmentView } from "./reinitInvestmentView";

export function* generateUpdatedView(
  validationResult: TInvestmentValidationResult,
  investmentValueType: EInvestmentValueType,
  value: string,
): Generator<any, any, any> {
  const { validationError, investmentDetails } = validationResult;
  if (validationError !== null) {
    switch (validationError) {
      case EInputValidationError.IS_EMPTY: {
        return yield call(reinitInvestmentView);
      }
      case EInputValidationError.NOT_A_NUMBER:
      case EInvestmentErrorState.AboveMaximumTicketSize:
      case EInvestmentErrorState.BelowMinimumTicketSize:
      case EInvestmentErrorState.ExceedsTokenAmount:
      case EInvestmentErrorState.ExceedsWalletBalance:
      case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS: {
        return yield call(populateInvalidViewData, value, validationError);
      }
    }
  } else {
    const { investmentTransaction, euroValueUlps, ethValueUlps } = investmentDetails;
    return yield call(
      calculateInvestmentCostsData,
      value,
      investmentValueType,
      {
        euroValueUlps,
        ethValueUlps,
      },
      investmentTransaction,
    );
  }
}
