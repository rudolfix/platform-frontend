import * as detectBrowser from "detect-browser";

import { symbols } from "../../di/symbols";
import { injectableFn } from "../../middlewares/redux-injectify";
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
    [symbols.appDispatch],
  ),
};
