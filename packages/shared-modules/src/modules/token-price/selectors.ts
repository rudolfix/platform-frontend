import { assertNever, ECurrency, multiplyBigNumbers } from "@neufund/shared-utils";

import { TTokenPriceModuleState } from "./module";
import { ITokenPriceStateData } from "./reducer";

export const selectTokenPriceData = (
  state: TTokenPriceModuleState,
): ITokenPriceStateData | undefined => state.tokenPrice.tokenPriceData;

export const selectEtherPriceEur = (state: TTokenPriceModuleState): string => {
  const data = selectTokenPriceData(state);
  return data?.etherPriceEur || "0";
};

export const selectNeuPriceEur = (state: TTokenPriceModuleState): string => {
  const data = selectTokenPriceData(state);
  return data?.neuPriceEur || "0";
};

export const selectEurPriceEther = (state: TTokenPriceModuleState): string => {
  const data = selectTokenPriceData(state);
  return data?.eurPriceEther || "0";
};

export const selectEurEquivalent = (
  state: TTokenPriceModuleState,
  amount: string,
  currency: ECurrency,
) => {
  switch (currency) {
    case ECurrency.NEU:
      return multiplyBigNumbers([selectNeuPriceEur(state), amount]);
    case ECurrency.EUR:
    case ECurrency.EUR_TOKEN:
      return amount;
    case ECurrency.ETH:
      return multiplyBigNumbers([selectEtherPriceEur(state), amount]);
    default:
      return assertNever(currency, `Not able to calculate Eur equivalent for ${currency}`);
  }
};
