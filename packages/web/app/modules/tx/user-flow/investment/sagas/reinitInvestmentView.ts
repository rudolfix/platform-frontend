import { call, select } from "@neufund/sagas";

import { selectTxUserFlowInvestmentState } from "../selectors";
import { EInvestmentFormState, TTxUserFlowInvestmentReadyState } from "../types";
import { getInvestmentCurrency } from "../utils";

export function* reinitInvestmentView(): Generator<any, any, any> {
  const {
    eto,
    wallets,
    investmentWallet,
    minTicketEur,
    minTicketEth,
    hasPreviouslyInvested,
    etoTokenGeneralDiscounts,
    etoTokenPersonalDiscount,
    etoTokenStandardPrice,
    minEthTicketFormatted,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const investmentCurrency = yield call(getInvestmentCurrency, investmentWallet);

  return {
    formState: EInvestmentFormState.EMPTY,
    eto,
    wallets,
    investmentValue: "",
    euroValueWithFallback: "0",
    investmentWallet,
    investmentCurrency,
    totalCostEth: "0",
    totalCostEuro: "0",
    minTicketEur,
    minTicketEth,
    hasPreviouslyInvested,
    minEthTicketFormatted,
    etoTokenGeneralDiscounts,
    etoTokenPersonalDiscount,
    etoTokenStandardPrice,
  };
}
