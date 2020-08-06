import { TAppGlobalState } from "../../store";

export const selectGovernanceData = (state: TAppGlobalState) => state.governance;

export const selectGovernanceVisible = (state: TAppGlobalState) =>
  selectGovernanceData(state).tabVisible;

export const selectGovernanceResolutions = (state: TAppGlobalState) =>
  selectGovernanceData(state).resolutions;

export const showGovernanceUpdateModal = (state: TAppGlobalState) =>
  selectGovernanceData(state).showGovernanceUpdateModal;
