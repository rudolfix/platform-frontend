import { select } from "@neufund/sagas";
import BigNumber from "bignumber.js";

import { selectEtherPriceEur, selectEurPriceEther } from "../../../../shared/tokenPrice/selectors";
import { EInvestmentCurrency } from "../types";

export function* computeCurrencies(
  valueUlps: string,
  currency: EInvestmentCurrency,
): Generator<any, any, any> {
  const etherPriceEur = yield select(selectEtherPriceEur);
  const eurPriceEther = yield select(selectEurPriceEther);

  if (etherPriceEur && etherPriceEur !== "0") {
    const valueAsBigNumber = new BigNumber(valueUlps);
    switch (currency) {
      case EInvestmentCurrency.ETH:
        const eurVal = valueAsBigNumber.mul(etherPriceEur);
        return {
          ethValueUlps: valueAsBigNumber.toFixed(0, BigNumber.ROUND_UP),
          euroValueUlps: eurVal.toFixed(0, BigNumber.ROUND_UP),
        };
      case EInvestmentCurrency.EUR_TOKEN:
        const ethVal = valueAsBigNumber.mul(eurPriceEther);
        return {
          ethValueUlps: ethVal.toFixed(0, BigNumber.ROUND_UP),
          euroValueUlps: valueAsBigNumber.toFixed(0, BigNumber.ROUND_UP),
        };
    }
  }
}
