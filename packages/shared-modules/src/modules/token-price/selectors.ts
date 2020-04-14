import { assertNever, ECurrency, multiplyBigNumbers } from "@neufund/shared";
import { StateFromReducersMapObject } from "redux";

import { ITokenPriceStateData, tokenPriceReducerMap } from "./reducer";

type TModuleState = StateFromReducersMapObject<typeof tokenPriceReducerMap>;

export const selectTokenPriceData = (state: TModuleState): ITokenPriceStateData | undefined =>
  state.tokenPrice.tokenPriceData;

export const selectEtherPriceEur = (state: TModuleState): string => {
  const data = selectTokenPriceData(state);
  return data?.etherPriceEur || "0";
};

export const selectNeuPriceEur = (state: TModuleState): string => {
  const data = selectTokenPriceData(state);
  return data?.neuPriceEur || "0";
};

export const selectEurPriceEther = (state: TModuleState): string => {
  const data = selectTokenPriceData(state);
  return data?.eurPriceEther || "0";
};

export const selectEurEquivalent = (state: TModuleState, amount: string, currency: ECurrency) => {
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
