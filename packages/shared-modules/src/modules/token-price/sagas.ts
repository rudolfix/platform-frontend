import { call, delay, fork, neuTakeLatestUntil, put, SagaGenerator, take } from "@neufund/sagas";
import { Q18, StringableActionCreator } from "@neufund/shared-utils";

import { neuGetBindings } from "../../utils";
import { contractsModuleApi } from "../contracts/module";
import { coreModuleApi } from "../core/module";
import { tokenPriceActions } from "./actions";
import { TOKEN_REFRESH_DELAY } from "./constants";
import { ITokenPriceStateData } from "./reducer";

export function* loadTokenPriceDataAsync(): SagaGenerator<ITokenPriceStateData> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: contractsModuleApi.symbols.contractsService,
  });

  return yield* call(() =>
    contractsService.rateOracle
      .getExchangeRates(
        [
          contractsService.etherToken.address,
          contractsService.neumark.address,
          contractsService.euroToken.address,
        ],
        [
          contractsService.euroToken.address,
          contractsService.euroToken.address,
          contractsService.etherToken.address,
        ],
      )
      .then(r =>
        Object.assign(
          contractsModuleApi.utils.numericValuesToString({
            etherPriceEur: r[0][0].div(Q18),
            neuPriceEur: r[0][1].div(Q18),
            eurPriceEther: r[0][2].div(Q18),
          }),
          { priceOutdated: false },
        ),
      ),
  );
}

function* tokenPriceMonitor(
  _: unknown,
  refreshOnAction: StringableActionCreator<any, any, any> | undefined,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  while (true) {
    try {
      logger.info("Querying for tokenPrice");

      const tokenPriceData = yield* call(loadTokenPriceDataAsync);

      yield put(tokenPriceActions.saveTokenPrice(tokenPriceData));
    } catch (e) {
      logger.error(e, "Token Price Oracle Failed");
    }

    if (refreshOnAction) {
      yield* take(refreshOnAction);
    } else {
      yield delay(TOKEN_REFRESH_DELAY);
    }
  }
}

type TSetupSagasConfig = {
  refreshOnAction: StringableActionCreator<any, any, any> | undefined;
};

export function setupTokenPriceSagas(config: TSetupSagasConfig): () => SagaGenerator<void> {
  return function*(): SagaGenerator<void> {
    yield fork(
      neuTakeLatestUntil,
      tokenPriceActions.watchTokenPriceStart,
      tokenPriceActions.watchTokenPriceStop,
      tokenPriceMonitor,
      config.refreshOnAction,
    );
  };
}
