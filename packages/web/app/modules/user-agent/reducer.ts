import { TBrowserName } from "../../lib/dependencies/detectBrowser";
import { AppReducer, TAppGlobalState } from "../../store";

export interface IUserAgentState {
  name: TBrowserName;
  version: string;
}

const userAgentInitialState: IUserAgentState = {
  name: "unknown",
  version: "0",
};

export const browserReducer: AppReducer<IUserAgentState> = (
  state = userAgentInitialState,
  action,
): IUserAgentState => {
  switch (action.type) {
    case "LOAD_USER_AGENT_INFO_ACTION":
      return {
        name: action.payload.name,
        version: action.payload.version,
      };
  }

  return state;
};

export function isSupportingLedger(state: TAppGlobalState): boolean {
  return !state.browser.name || state.browser.name === "chrome";
}
