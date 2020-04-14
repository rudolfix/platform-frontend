import { createActionFactory } from "@neufund/shared";

import { ITokenPriceStateData } from "./reducer";

export const tokenPriceActions = {
  watchTokenPriceStart: createActionFactory("TOKEN_PRICE_WATCH_START"),
  watchTokenPriceStop: createActionFactory("TOKEN_PRICE_WATCH_STOP"),
  loadTokenPriceStart: createActionFactory("TOKEN_PRICE_LOAD_START"),
  saveTokenPrice: createActionFactory(
    "TOKEN_PRICE_SAVE",
    (tokenPriceData: ITokenPriceStateData) => ({ tokenPriceData }),
  ),
};
