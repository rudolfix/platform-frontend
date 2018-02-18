import * as detectBrowser from "detect-browser";

import { injectableFn } from "../../redux-injectify";
import { AppDispatch } from "../../store";
import { symbols } from "../../symbols";
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
