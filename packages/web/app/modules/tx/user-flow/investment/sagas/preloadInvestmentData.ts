import { all, put, take } from "@neufund/sagas";

import { actions } from "../../../../actions";
import { TEtoWithCompanyAndContractReadonly } from "../../../../eto/types";

export function* preloadInvestmentData(
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, any, any> {
  yield all([
    put(actions.investorEtoTicket.loadTokenPersonalDiscount(eto)),
    put(actions.eto.loadTokenTerms(eto)),

    take(actions.eto.setTokenGeneralDiscounts),
    take(actions.investorEtoTicket.setTokenPersonalDiscount),
  ]);
}
