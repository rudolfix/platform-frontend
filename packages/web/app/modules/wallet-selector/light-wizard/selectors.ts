import { TAppGlobalState } from "../../../store";

export const selectLightWalletRecoveryPhase = (state: TAppGlobalState) =>
  state.lightWalletWizard.recoveryPhase;
