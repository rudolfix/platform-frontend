import { AppReducer } from "../../store";

export interface IUserAgentState {
  name?: string;
  version?: string;
}

const userAgentInitialState: IUserAgentState = {};

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

export function isSupportingLedger(state: IUserAgentState): boolean {
  return !state.name || state.name === "chrome" || state.name === "firefox";
}
