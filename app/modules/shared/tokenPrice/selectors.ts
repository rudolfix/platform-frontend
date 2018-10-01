import { ITokenPriceState, ITokenPriceStateData } from "./reducer";

export const selectEtherPriceEur = (state: ITokenPriceState): string =>
  (state.tokenPriceData && state.tokenPriceData.etherPriceEur) || "0";

export const selectNeuPriceEur = (state: ITokenPriceState): string =>
  (state.tokenPriceData && state.tokenPriceData.neuPriceEur) || "0";

export const selectTokenPriceData = (state: ITokenPriceState): ITokenPriceStateData | undefined =>
  state.tokenPriceData;
