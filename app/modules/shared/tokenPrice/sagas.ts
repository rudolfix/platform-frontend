import { BigNumber } from "bignumber.js";
import * as promiseAll from "promise-all";
import { delay } from "redux-saga";
import { put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";
import { numericValuesToString } from "../../contracts/utils";
import { neuTakeUntil } from "../../sagasUtils";
import { ITokenPriceStateData } from "./reducer";

const TOKEN_PRICE_MONITOR_DELAY = 5000;

export async function loadTokenPriceData(): Promise<ITokenPriceStateData> {
  // @todo Connect data with smart contract
  return numericValuesToString(
    await promiseAll({
      etherPriceEur: Promise.resolve(new BigNumber("483.96")),
      neuPriceEur: Promise.resolve(new BigNumber("0.500901")),
    }),
  );
}

function* tokenPriceMonitor({ logger }: TGlobalDependencies): any {
  while (true) {
    logger.info("Querying for tokenPrice");

    const tokenPriceData = yield loadTokenPriceData();
    yield put(actions.tokenPrice.saveTokenPrice(tokenPriceData));

    yield delay(TOKEN_PRICE_MONITOR_DELAY);
  }
}

export function* tokenPriceSagas(): any {
  yield neuTakeUntil("AUTH_LOAD_USER", "AUTH_LOGOUT", tokenPriceMonitor);
}
