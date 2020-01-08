import { call, put, select } from "redux-saga/effects";

import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  formatNumber,
  selectDecimalPlaces,
} from "../../../../../components/shared/formatters/utils";
import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { convertFromUlps } from "../../../../../utils/NumberUtils";
import { actions, TActionFromCreator } from "../../../../actions";
import { selectTxUserFlowInvestmentState } from "../selectors";
import { EInvestmentValueType, EInvestmentWallet, TTxUserFlowInvestmentReadyState } from "../types";
import { calculateEntireBalanceValue } from "./calculateEntireBalanceValue";
import { generateUpdatedView } from "./generateUpdatedView";
import { investEntireBalance } from "./investEntireBalance";
import { inputIsInvalid, validateInvestmentValue } from "./validateInvestmentValue";

function* formatBalance(
  value: string,
  investmentWallet: EInvestmentWallet,
): Generator<any, string, any> {
  let valueType: ECurrency;
  switch (investmentWallet) {
    case EInvestmentWallet.ICBMEth:
    case EInvestmentWallet.Eth:
      valueType = ECurrency.ETH;
      break;

    case EInvestmentWallet.NEur:
    case EInvestmentWallet.ICBMnEuro:
      valueType = ECurrency.ETH;
      break;
  }
  const outputFormat = ENumberOutputFormat.FULL;

  return formatNumber({
    value,
    inputFormat: ENumberInputFormat.FLOAT,
    roundingMode: ERoundingMode.DOWN,
    outputFormat,
    decimalPlaces: selectDecimalPlaces(valueType, outputFormat),
  });
}

function* valueIsEntireBalance(
  investmentWallet: EInvestmentWallet,
  value: string,
): Generator<any, any, any> {
  if (yield call(inputIsInvalid, value)) {
    return false;
  }

  const fullWalletBalance = convertFromUlps(
    yield call(calculateEntireBalanceValue, investmentWallet, EInvestmentValueType.PARTIAL_BALANCE),
  ).toString();
  const formattedInvestmentValue = yield call(formatBalance, value, investmentWallet);
  const formattedFullWalletBalance = yield call(formatBalance, fullWalletBalance, investmentWallet);

  return formattedInvestmentValue === formattedFullWalletBalance;
}

export function* updateInvestmentView(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txUserFlowInvestment.updateValue>,
): Generator<any, any, any> {
  const {
    investmentCurrency,
    investmentValue: oldValue,
    investmentWallet,
    etoId,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  if (payload.value === oldValue) {
    return;
  }

  // many api calls ahead, set investment value to show it in the UI in the meantime
  yield put(actions.txUserFlowInvestment.setInvestmentValue(payload.value));
  yield put(actions.txUserFlowInvestment.setFormStateValidating());

  // in case user types in the full amount as they see it in the UI (truncated to 2/4 decimal places and rounded up),
  // we switch to 'invest entire balance' flow.
  // To check it we format the investment wallet balance the same way it's shown in the UI
  // and compare to input value
  if (yield call(valueIsEntireBalance, investmentWallet, payload.value)) {
    //TODO formatting of wallet balances should be done in initInvestmentView saga, UI should only get strings ready to be shown
    yield call(investEntireBalance);
  } else {
    const validationResult = yield call(validateInvestmentValue, {
      value: payload.value,
      investmentCurrency,
      investmentWallet,
      etoId,
      investmentValueType: EInvestmentValueType.PARTIAL_BALANCE,
    });
    const investmentCalculatedData = yield call(
      generateUpdatedView,
      validationResult,
      EInvestmentValueType.PARTIAL_BALANCE,
      payload.value,
    );
    yield put(actions.txUserFlowInvestment.setViewData(investmentCalculatedData));
  }
}
