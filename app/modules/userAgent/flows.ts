import * as detectBrowser from "detect-browser";

import { APP_DISPATCH_SYMBOL } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { AppDispatch } from "../../store";
import { actions } from "../actions";

export const userAgentFlows = {
  detectUserAgent: injectableFn(
    (dispatch: AppDispatch) => {
      const userAgentInfo = detectBrowser.detect();

      if (userAgentInfo) {
        dispatch(actions.userAgent.loadUserAgentInfo(userAgentInfo.name, userAgentInfo.version));
      }
    },
    [APP_DISPATCH_SYMBOL],
  ),
};
