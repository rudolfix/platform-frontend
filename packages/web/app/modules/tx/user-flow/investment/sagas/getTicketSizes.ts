import { call } from "redux-saga/effects";

import { ERoundingMode } from "../../../../../components/shared/formatters/utils";
import { multiplyBigNumbers } from "../../../../../utils/BigNumberUtils";
import { TEtoWithCompanyAndContractReadonly } from "../../../../eto/types";
import { EInvestmentType } from "../types";
import { formatMinMaxTickets } from "../utils";
import { getCalculatedContribution } from "./getCalculatedContribution";

export type TGetmaxTicketEurInput = {
  eto: TEtoWithCompanyAndContractReadonly;
  euroValueUlps: string;
  investmentType: EInvestmentType;
  eurPriceEther: string;
};

export function* getTicketSizes({
  eto,
  euroValueUlps,
  investmentType,
  eurPriceEther,
}: TGetmaxTicketEurInput): Generator<any, any, any> {
  const etoTicketSizes = yield call(getCalculatedContribution, {
    eto,
    euroValueUlps,
    investmentType,
  });

  const minTicketEur =
    (etoTicketSizes.minTicketEurUlps &&
      formatMinMaxTickets(etoTicketSizes.minTicketEurUlps, ERoundingMode.UP)) ||
    "0";

  const maxTicketEur =
    (etoTicketSizes.maxTicketEurUlps &&
      formatMinMaxTickets(etoTicketSizes.maxTicketEurUlps, ERoundingMode.DOWN)) ||
    "0";

  const minTicketEth = yield call(multiplyBigNumbers, [minTicketEur, eurPriceEther]);
  const maxTicketEth = yield call(multiplyBigNumbers, [maxTicketEur, eurPriceEther]);

  return {
    minTicketEur,
    maxTicketEur,
    minTicketEth,
    maxTicketEth,
  };
}
