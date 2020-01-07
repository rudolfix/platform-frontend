import { all, call, put, select } from "redux-saga/effects";

import { convertFromUlps } from "../../../../../utils/NumberUtils";
import { actions } from "../../../../actions";
import { selectTxUserFlowInvestmentState } from "../selectors";
import { EInvestmentValueType, TTxUserFlowInvestmentReadyState } from "../types";
import { calculateEntireBalanceValue } from "./calculateEntireBalanceValue";
import { generateUpdatedView } from "./generateUpdatedView";
import { validateInvestmentValue } from "./validateInvestmentValue";

export function* investEntireBalance(): Generator<any, any, any> {
  const {
    investmentWallet,
    investmentCurrency,
    etoId,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const balance = yield call(calculateEntireBalanceValue, investmentWallet);
  const balanceFromUlps = (yield call(convertFromUlps, balance)).toString();

  yield all([
    put(actions.txUserFlowInvestment.setInvestmentValue(balanceFromUlps)),
    put(actions.txUserFlowInvestment.setFormStateValidating()),
  ]);

  const validationResult = yield call(validateInvestmentValue, {
    value: balanceFromUlps,
    investmentCurrency,
    investmentWallet,
    etoId,
    investmentValueType: EInvestmentValueType.FULL_BALANCE,
  });

  const viewData = yield call(
    generateUpdatedView,
    validationResult,
    EInvestmentValueType.FULL_BALANCE,
    balanceFromUlps,
  );
  yield put(actions.txUserFlowInvestment.setViewData(viewData));
}
