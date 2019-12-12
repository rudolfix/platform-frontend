import { call } from "redux-saga/effects";

import {
  isEmptyValue,
  parseInputToNumber,
} from "../../../../../components/shared/formatters/utils";
import { convertToUlps } from "../../../../../utils/NumberUtils";
import { neuCall } from "../../../../sagasUtils";
import { generateInvestmentTransaction } from "../../../transactions/investment/sagas";
import { EValidationState } from "../../../validator/reducer";
import {
  EInputValidationError,
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentType,
  EInvestmentValueType,
} from "../types";
import { chooseTransactionValue } from "../utils";
import { computeCurrencies } from "./computeCurrencies";
import { validateInvestmentLimits } from "./validateInvestmentLimits";
import { validateTxGas } from "./validateTxGas";

export type TValidateInvestmentValueInput = {
  value: string;
  investmentCurrency: EInvestmentCurrency;
  investmentType: EInvestmentType;
  etoId: string;
  investmentValueType: EInvestmentValueType;
};

export function* validateInvestmentValue({
  value,
  investmentCurrency,
  investmentType,
  etoId,
  investmentValueType,
}: TValidateInvestmentValueInput): Generator<any, any, any> {
  const isEmpty = yield call(isEmptyValue, value);
  if (isEmpty) {
    return { validationError: EInputValidationError.IS_EMPTY, txDetails: null };
  }

  const isAValidNumber = yield call(parseInputToNumber, value);
  if (!isAValidNumber) {
    return { validationError: EInputValidationError.NOT_A_NUMBER, txDetails: null };
  }

  const investmentValueUlps = yield call(convertToUlps, value);
  const { euroValueUlps, ethValueUlps } = yield call(
    computeCurrencies,
    investmentValueUlps,
    investmentCurrency,
  );

  const validationError: EInvestmentErrorState | undefined = yield call(validateInvestmentLimits, {
    euroValueUlps,
    ethValueUlps,
  });
  if (validationError) {
    return { validationError: validationError, txDetails: null };
  }

  const investmentTransaction = yield neuCall(generateInvestmentTransaction, {
    investmentValueType,
    investmentType,
    etoId,
    investAmountUlps: chooseTransactionValue(
      investmentValueType,
      investmentType,
      ethValueUlps,
      euroValueUlps,
    ),
  });

  const txValidationResult = yield call(validateTxGas, investmentTransaction);
  if (txValidationResult !== EValidationState.VALIDATION_OK) {
    return { validationError: txValidationResult, txDetails: null };
  } else {
    return {
      validationError: null,
      investmentDetails: { investmentTransaction, euroValueUlps, ethValueUlps },
    };
  }
}
