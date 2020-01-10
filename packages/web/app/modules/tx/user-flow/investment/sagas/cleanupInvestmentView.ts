import { put } from "@neufund/sagas";

import { actions } from "../../../../actions";

export function* cleanupInvestmentView(): Generator<any, any, any> {
  yield put(actions.txUserFlowInvestment.reset());
}
