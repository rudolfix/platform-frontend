import { call } from "@neufund/sagas";

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
  EInvestmentValueType,
  EInvestmentWallet,
} from "../types";
import { chooseTransactionValue } from "../utils";
import { computeCurrencies } from "./computeCurrencies";
import { validateInvestmentLimits } from "./validateInvestmentLimits";
import { validateTxGas } from "./validateTxGas";

export type TValidateInvestmentValueInput = {
  value: string;
  investmentCurrency: EInvestmentCurrency;
  investmentWallet: EInvestmentWallet;
  etoId: string;
  investmentValueType: EInvestmentValueType;
};

export function* inputIsInvalid(value: string): Generator<any, any, any> {
  const isEmpty = yield call(isEmptyValue, value);
  if (isEmpty) {
    return { validationError: EInputValidationError.IS_EMPTY, txDetails: null };
  }

  const isValidNumber = yield call(parseInputToNumber, value);
  if (!isValidNumber) {
    return { validationError: EInputValidationError.NOT_A_NUMBER, txDetails: null };
  }
  return undefined;
}

export function* validateInvestmentValue({
  value,
  investmentCurrency,
  investmentWallet,
  etoId,
  investmentValueType,
}: TValidateInvestmentValueInput): Generator<any, any, any> {
  const inputValidationError = yield inputIsInvalid(value);

  if (inputValidationError) {
    return inputValidationError;
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
    investmentWallet,
    etoId,
    investAmountUlps: chooseTransactionValue(
      investmentValueType,
      investmentWallet,
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
