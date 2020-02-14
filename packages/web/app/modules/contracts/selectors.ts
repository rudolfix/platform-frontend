import { TAppGlobalState } from "../../store";

export const selectPlatformTermsConstants = (state: TAppGlobalState) =>
  state.contracts.platformTermsConstants;
