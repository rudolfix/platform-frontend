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
import { actions, TActionFromCreator } from "../../../../actions";
import { selectTxUserFlowInvestmentState } from "../selectors";
import { EInvestmentValueType, EInvestmentWallet, TTxUserFlowInvestmentReadyState } from "../types";
import { calculateEntireBalanceValue } from "./calculateEntireBalanceValue";
import { generateUpdatedView } from "./generateUpdatedView";
import { investEntireBalance } from "./investEntireBalance";
import { validateInvestmentValue } from "./validateInvestmentValue";

function* formatEntireBalance(investmentWallet: EInvestmentWallet): Generator<any, string, any> {
  const balance = yield call(calculateEntireBalanceValue, investmentWallet);

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
    value: balance,
    inputFormat: ENumberInputFormat.ULPS,
    roundingMode: ERoundingMode.DOWN,
    outputFormat,
    decimalPlaces: selectDecimalPlaces(valueType, outputFormat),
  });
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

  if (payload.value === (yield call(formatEntireBalance, investmentWallet))) {
    // if user types in the full amount, switch to entire balance investment flow
    // in order to check it we format the investment wallet balance the same way it's shown in the UI
    // and compare with input value
    //TODO formatting should be done in initInvestmentView saga
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
