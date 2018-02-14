import * as detectBrowser from "detect-browser";

import { DispatchSymbol } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { AppDispatch, IAppAction } from "../../store";
import { makeActionCreator } from "../../storeHelpers";

export interface ILoadUserAgentInfoAction extends IAppAction {
  type: "LOAD_USER_AGENT_INFO_ACTION";
  payload: {
    name?: string;
    version?: string;
  };
}

export const loadUserAgentInfoAction = makeActionCreator<ILoadUserAgentInfoAction>(
  "LOAD_USER_AGENT_INFO_ACTION",
);

export const detectUserAgentAction = injectableFn(
  (dispatch: AppDispatch) => {
    const userAgentInfo = detectBrowser.detect();

    if (userAgentInfo) {
      dispatch(
        loadUserAgentInfoAction({
          name: userAgentInfo.name,
          version: userAgentInfo.version,
        }),
      );
    }
  },
  [DispatchSymbol],
);
