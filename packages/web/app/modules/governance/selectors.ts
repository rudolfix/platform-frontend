import { TAppGlobalState } from "../../store";

export const selectGovernanceData = (state: TAppGlobalState) => state.governance;

export const selectGovernanceVisible = (state: TAppGlobalState) =>
  selectGovernanceData(state).tabVisible;
