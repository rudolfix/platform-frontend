import { all, put, select } from "@neufund/sagas";
import { call } from "typed-redux-saga";

import { convertFromUlps } from "../../../../../utils/NumberUtils";
import { actions } from "../../../../actions";
import { selectTxUserFlowInvestmentState } from "../selectors";
import { EInvestmentValueType, TTxUserFlowInvestmentReadyState } from "../types";
import { calculateEntireBalanceValue } from "./calculateEntireBalanceValue";
import { generateUpdatedView } from "./generateUpdatedView";
import { validateInvestmentValue } from "./validateInvestmentValue";

export function* investEntireBalance(): Generator<any, any, any> {
  // There's a special handling of investing *entire* eth balance:
  // It's not possible to estimate the gas cost via contract because it only throws if the tx amount is
  // larger than the available balance, without returning any sensible info.
  // Because of this we first subtract some preset estimated gas cost (see calculateEntireBalanceValue -> selectFakeTxGasCostEthUlps)
  // from the available balance to have a safety margin when sending the investment tx to the contract.
  // Later, on submit, we recalculate the investment tx value with real gas costs, which are always expected
  // to be lower than our dummy gas cost.
  // (In the end there's always some leftovers left on the users balance. It's not possible to really withdraw _all_ eth)
  // In case of withdrawing full balance in other currencies there's a gas stipend that covers this.
  const {
    investmentWallet,
    investmentCurrency,
    etoId,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const balance = yield call(
    calculateEntireBalanceValue,
    investmentWallet,
    EInvestmentValueType.FULL_BALANCE,
  );
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
