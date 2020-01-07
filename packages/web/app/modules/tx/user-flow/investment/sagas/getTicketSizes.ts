import { call } from "redux-saga/effects";

import { ERoundingMode } from "../../../../../components/shared/formatters/utils";
import { multiplyBigNumbers } from "../../../../../utils/BigNumberUtils";
import { TEtoWithCompanyAndContractReadonly } from "../../../../eto/types";
import { EInvestmentWallet } from "../types";
import { formatMinMaxTickets } from "../utils";
import { getCalculatedContribution } from "./getCalculatedContribution";

export type TGetmaxTicketEurInput = {
  eto: TEtoWithCompanyAndContractReadonly;
  euroValueUlps: string;
  investmentWallet: EInvestmentWallet;
  eurPriceEther: string;
};

export function* getTicketSizes({
  eto,
  euroValueUlps,
  investmentWallet,
  eurPriceEther,
}: TGetmaxTicketEurInput): Generator<any, any, any> {
  const etoTicketSizes = yield call(getCalculatedContribution, {
    eto,
    euroValueUlps,
    investmentWallet,
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
