import { call, select } from "@neufund/sagas";

import { TEtoSpecsData } from "../../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TEtoWithCompanyAndContractReadonly } from "../../../../eto/types";
import { loadComputedContributionFromContract } from "../../../../investor-portfolio/sagas";
import { selectInvestorTicket } from "../../../../investor-portfolio/selectors";
import { neuCall } from "../../../../sagasUtils";
import { EInvestmentWallet } from "../types";
import { calculateTicketLimitsUlps, isIcbmInvestment } from "../utils";

export type TGetCalculatedContributionInput = {
  eto: TEtoWithCompanyAndContractReadonly;
  euroValueUlps: string;
  investmentWallet: EInvestmentWallet;
};

export function* getCalculatedContribution({
  eto,
  euroValueUlps,
  investmentWallet,
}: TGetCalculatedContributionInput): Generator<any, any, any> {
  const isICBM = yield call(isIcbmInvestment, investmentWallet);
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
