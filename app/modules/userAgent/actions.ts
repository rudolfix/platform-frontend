import { createAction } from "../actions";

export const userAgentActions = {
  loadUserAgentInfo: (name?: string, version?: string) =>
    createAction("LOAD_USER_AGENT_INFO_ACTION", { name, version }),
};
