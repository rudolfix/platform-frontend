import { put, select } from "@neufund/sagas";

import { actions } from "../../actions";
import { neuCall } from "../../sagasUtils";
import { detectWeb3 } from "../../wallet-selector/browser-wizard/operations/sagas";
import { selectHasRedirectedToBrowserAlready } from "./../selectors";

/**
 * @generator special routing generator that gets triggered when the router hits register/light
 *
 * @param redirectGenerator the redirect generator in case a browser wallet is found
 * @param fallBackGenerator the fallback generator in case a browser wallet is not found
 *
 * @note An auto redirect occurs only for investors.
 * @note Auto redirect happens only the first time the user tries to register once the state is set we don't redirect
 *
 * @return the generator either returns the redirect generator or returns the fallback generator
 */
export function* redirectToBrowserWallet(
  redirectGenerator: Generator,
  fallBackGenerator: Generator,
): Generator<any, any, any> {
  const doesBrowserWalletExist = yield* neuCall(detectWeb3);
  const hasAlreadyRedirected: boolean = yield* select(selectHasRedirectedToBrowserAlready);
  if (doesBrowserWalletExist && !hasAlreadyRedirected) {
    yield put(actions.routing.setBrowserAutoRedirect(true));
    return yield redirectGenerator;
  } else {
    return yield fallBackGenerator;
  }
}


