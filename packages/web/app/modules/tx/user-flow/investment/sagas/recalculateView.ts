import { call, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { actions } from "../../../../actions";
import { selectTxUserFlowInvestmentState } from "../selectors";
import { EInvestmentFormState, TTxUserFlowInvestmentReadyState } from "../types";
import { generateUpdatedView } from "./generateUpdatedView";
import { validateInvestmentValue } from "./validateInvestmentValue";

export function* recalculateView(_: TGlobalDependencies): Generator<any, any, any> {
  const {
    formState,
    investmentValue,
    investmentCurrency,
    investmentType,
    etoId,
    investmentValueType,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  //recalculate only if there's user has entered any data in the form.
  if (formState === EInvestmentFormState.INVALID || formState === EInvestmentFormState.VALID) {
    yield put(actions.txUserFlowInvestment.setFormStateValidating());

    const validationResult = yield call(validateInvestmentValue, {
      value: investmentValue,
      investmentCurrency,
      investmentType,
      etoId,
      investmentValueType,
    });

    const viewData = yield call(
      generateUpdatedView,
      validationResult,
      investmentValueType,
      investmentValue,
    );
    yield put(actions.txUserFlowInvestment.setViewData(viewData));
  }
}
