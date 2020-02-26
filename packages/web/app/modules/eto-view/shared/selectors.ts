import { TAppGlobalState } from "../../../store";
import { EProcessState } from "../../../utils/enums/processStates";

export const selectEtoViewDataProcessState = (state: TAppGlobalState): EProcessState =>
  state.etoView.processState;

export const selectEtoViewData = (state: TAppGlobalState) => state.etoView;
