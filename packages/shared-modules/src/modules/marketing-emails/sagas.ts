import { fork, neuGetContainer, neuTakeEvery, put, select } from "@neufund/sagas";

import { TLibSymbolType, TModuleSymbols } from "../../types";
import { coreModuleApi } from "../core/module";
import { actions } from "./actions";
import { symbols } from "./lib/symbols";
import { selectUnsubscriptionLinkFromQueryString } from "./selectors";

type TDependencies = TModuleSymbols<typeof coreModuleApi>;

function* unsubscribeEmail({ logger }: TDependencies): Generator<any, void, any> {
  const container = yield* neuGetContainer();

  const marketingEmailsApi = container.get<TLibSymbolType<typeof symbols.marketingEmailsApi>>(
    symbols.marketingEmailsApi,
  );

  const unsubscribeLink = yield* select(selectUnsubscriptionLinkFromQueryString);

  if (!unsubscribeLink) {
    logger.error("Unsubscribe marketing emails link is empty");
    return;
  }

  try {
    yield marketingEmailsApi.unsubscribeMarketingEmails(unsubscribeLink);

    yield put(actions.unsubscribeSuccess());
  } catch (e) {
    logger.error("Failed to unsubscribe from marketing emails", e);
    yield put(actions.unsubscribeFailure());
  }
}

export function setupMarketingEmailsSagas(): () => Generator<any, any, any> {
  return function*(): Generator<any, void, any> {
    yield fork(neuTakeEvery, actions.unsubscribe, unsubscribeEmail);
  };
}
