import { AppReducer } from "../../../../store";
import { EProcessState } from "../../../../utils/enums/processStates";
import { actions } from "../../../actions";
import { EInvestmentFormState, TTxUserFlowInvestmentState } from "./types";

export const initialState: TTxUserFlowInvestmentState = { processState: EProcessState.NOT_STARTED };

export const txUserFlowInvestmentReducer: AppReducer<TTxUserFlowInvestmentState> = (
  state = initialState,
  action,
): TTxUserFlowInvestmentState => {
  switch (action.type) {
    case actions.txUserFlowInvestment.setEtoId.getType(): {
      return state.processState === EProcessState.NOT_STARTED
        ? {
            ...state,
            processState: EProcessState.IN_PROGRESS,
            etoId: action.payload.etoId,
          }
        : state;
    }
    case actions.txUserFlowInvestment.setViewData.getType(): {
      return state.processState !== EProcessState.NOT_STARTED
        ? {
            etoId: state.etoId,
            processState: EProcessState.SUCCESS,
            ...action.payload.data,
          }
        : state;
    }
    case actions.txUserFlowInvestment.reset.getType(): {
      return initialState;
    }
    case actions.txUserFlowInvestment.setInvestmentValue.getType(): {
      return state.processState === EProcessState.SUCCESS
        ? {
            ...state,
            investmentValue: action.payload.value,
          }
        : state;
    }
    case actions.txUserFlowInvestment.setFormStateValidating.getType(): {
      return state.processState === EProcessState.SUCCESS
        ? {
            ...state,
            formState: EInvestmentFormState.VALIDATING,
          }
        : state;
    }
    case actions.txUserFlowInvestment.setInvestmentType.getType(): {
      return state.processState === EProcessState.SUCCESS
        ? {
            ...state,
            investmentType: action.payload.investmentType,
          }
        : state;
    }
  }

  return state;
};
