import { TAppGlobalState } from "../../store";

export const selectGovernance = (state: TAppGlobalState) => state.governance;

export const selectGovernanceVisible = (state: TAppGlobalState) =>
  selectGovernance(state).tabVisible;

export const selectGovernanceResolutions = (state: TAppGlobalState) =>
  selectGovernance(state).resolutions;

export const showGovernanceUpdateModal = (state: TAppGlobalState) =>
  selectGovernance(state).showGovernanceUpdateModal;
