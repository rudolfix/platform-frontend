import { fork, neuTakeEvery, put, select } from "@neufund/sagas";

import { TModuleSymbols } from "../../types";
import { neuGetBindings } from "../../utils";
import { coreModuleApi } from "../core/module";
import { actions } from "./actions";
import { symbols } from "./lib/symbols";
import { selectUnsubscriptionLinkFromQueryString } from "./selectors";

type TDependencies = TModuleSymbols<typeof coreModuleApi>;

function* unsubscribeEmail({ logger }: TDependencies): Generator<any, void, any> {
  const { marketingEmailsApi } = yield* neuGetBindings({
    marketingEmailsApi: symbols.marketingEmailsApi,
  });

  const unsubscribeLink = yield* select(selectUnsubscriptionLinkFromQueryString);

  if (!unsubscribeLink) {
    logger.warn("Unsubscribe marketing emails link is empty");
    return;
  }

  try {
    yield marketingEmailsApi.unsubscribeMarketingEmails(unsubscribeLink);

    yield put(actions.unsubscribeSuccess());
  } catch (e) {
    logger.error(e, "Failed to unsubscribe from marketing emails");
    yield put(actions.unsubscribeFailure());
  }
}

export function setupMarketingEmailsSagas(): () => Generator<any, any, any> {
  return function*(): Generator<any, void, any> {
    yield fork(neuTakeEvery, actions.unsubscribe, unsubscribeEmail);
  };
}
