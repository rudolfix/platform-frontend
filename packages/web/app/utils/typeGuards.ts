import { EProcessState } from "./enums/processStates";

export const processStateIsSuccess = <T>(st: {
  processState: EProcessState;
}): st is { processState: EProcessState.SUCCESS } & T => st.processState === EProcessState.SUCCESS;
