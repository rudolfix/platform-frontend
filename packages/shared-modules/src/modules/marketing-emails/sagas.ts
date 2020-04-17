import { call, fork, neuTakeEvery, put, SagaGenerator, select } from "@neufund/sagas";

import { TModuleSymbols } from "../../types";
import { neuGetBindings } from "../../utils";
import { coreModuleApi } from "../core/module";
import { actions } from "./actions";
import { symbols } from "./lib/symbols";
import { selectUnsubscriptionLinkFromQueryString } from "./selectors";

type TDependencies = TModuleSymbols<typeof coreModuleApi>;

function* unsubscribeEmail({ logger }: TDependencies): SagaGenerator<void> {
  const { marketingEmailsApi } = yield* neuGetBindings({
    marketingEmailsApi: symbols.marketingEmailsApi,
  });

  const unsubscribeLink = yield* select(selectUnsubscriptionLinkFromQueryString);

  if (!unsubscribeLink) {
    logger.error("Unsubscribe marketing emails link is empty");
    return;
  }

  try {
    yield* call(() => marketingEmailsApi.unsubscribeMarketingEmails(unsubscribeLink));

    yield put(actions.unsubscribeSuccess());
  } catch (e) {
    logger.error("Failed to unsubscribe from marketing emails", e);
    yield put(actions.unsubscribeFailure());
  }
}

export function setupMarketingEmailsSagas(): () => SagaGenerator<void> {
  return function*(): SagaGenerator<void> {
    yield fork(neuTakeEvery, actions.unsubscribe, unsubscribeEmail);
  };
}
