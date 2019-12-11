import { call, select } from "redux-saga/effects";

import { TEtoSpecsData } from "../../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TEtoWithCompanyAndContractReadonly } from "../../../../eto/types";
import { loadComputedContributionFromContract } from "../../../../investor-portfolio/sagas";
import { selectInvestorTicket } from "../../../../investor-portfolio/selectors";
import { neuCall } from "../../../../sagasUtils";
import { EInvestmentType } from "../types";
import { calculateTicketLimitsUlps, isIcbmInvestment } from "../utils";

export type TGetCalculatedContributionInput = {
  eto: TEtoWithCompanyAndContractReadonly;
  euroValueUlps: string;
  investmentType: EInvestmentType;
};

export function* getCalculatedContribution({
  eto,
  euroValueUlps,
  investmentType,
}: TGetCalculatedContributionInput): Generator<any, any, any> {
  const isICBM = yield call(isIcbmInvestment, investmentType);
  const contribution = yield neuCall(
    loadComputedContributionFromContract,
    eto as TEtoSpecsData,
    euroValueUlps,
    isICBM,
  );
  const investorTicket = yield select(selectInvestorTicket, eto.etoId);

  return yield call(calculateTicketLimitsUlps, {
    contribution,
    eto: eto as TEtoSpecsData,
    investorTicket,
  });
}
