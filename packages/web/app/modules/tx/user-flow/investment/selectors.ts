import { IAppState } from "../../../../store";
import { EProcessState } from "../../../../utils/enums/processStates";

export const selectTxUserFlowInvestmentState = (state: IAppState) => state.txUserFlowInvestment;

export const selectTxUserFlowInvestmentEtoId = (state: IAppState): string | undefined =>
  state.txUserFlowInvestment.processState !== EProcessState.NOT_STARTED
    ? state.txUserFlowInvestment.etoId
    : undefined;
