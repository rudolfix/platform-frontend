import { AppReducer } from "../../../../store";
import { actions } from "../../../actions";
import { TEtoWithCompanyAndContractReadonly } from "../../../eto/types";
import { EProcessState } from "../../../../utils/enums/processStates";
import { DeepReadonly } from "../../../../types";
import { EInvestmentCurrency } from "../../../../components/modals/tx-sender/investment-flow/utils";
import { WalletSelectionData } from "../../../../components/modals/tx-sender/investment-flow/InvestmentTypeSelector";
import { EInvestmentErrorState, EInvestmentType } from "../../../investment-flow/reducer";

export enum EInvestmentFormState {
  EMPTY = "empty",
  VALIDATING = "VALIDATING",
  VALID = "valid",
  INVALID = "invalid"
}

export type TTxUserFlowInvestmentBasicData = {
  eto: TEtoWithCompanyAndContractReadonly,
  wallets: DeepReadonly<WalletSelectionData[]>,
  investmentValue: string,
  euroValueWithFallback: string,
  investmentType: EInvestmentType,
  investmentCurrency: EInvestmentCurrency,
  totalCostEth: string,
  totalCostEuro: string,
  hasPreviouslyInvested: boolean,
  minTicketEur: string,
  minEthTicketFormatted: string,
}

export type TTxUserFlowInvestmentErrorData = {
  error: TInvestmentInputError,
}

export type TTxUserFlowInvestmentCalculatedCostsData = {
  gasCostEth: string,
  gasCostEuro: string,
  maxTicketEur: string,
  neuReward: string,
  etoTokenGeneralDiscounts: string,
  etoTokenPersonalDiscount: string,
  etoTokenStandardPrice: string,
  equityTokenCountFormatted: string,
}

export type TTxUserFlowInvestmentViewData =
  | {formState: EInvestmentFormState.EMPTY} & TTxUserFlowInvestmentBasicData
  | {formState: EInvestmentFormState.INVALID} & TTxUserFlowInvestmentBasicData & TTxUserFlowInvestmentErrorData
  | {formState: EInvestmentFormState.VALID} & TTxUserFlowInvestmentBasicData & TTxUserFlowInvestmentCalculatedCostsData;

export enum EInvestmentInputValidationError {
  INPUT_VALIDATION_ERROR = "inputValidationError",
}

export type TInvestmentInputError = EInvestmentErrorState & EInvestmentInputValidationError

export type TTxUserFlowInvestmentReadyState =
  { processState: EProcessState.SUCCESS } & { etoId: string } & TTxUserFlowInvestmentViewData

export type TTxUserFlowInvestmentInProgressState =
  { processState: EProcessState.ERROR | EProcessState.IN_PROGRESS } & { etoId: string }


export type TTxUserFlowInvestmentState =
  | { processState: EProcessState.NOT_STARTED }
  | TTxUserFlowInvestmentInProgressState
  | TTxUserFlowInvestmentReadyState


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
          etoId: action.payload.etoId
        }
        : state
    }
    case actions.txUserFlowInvestment.setViewData.getType(): {
      return state.processState !== EProcessState.NOT_STARTED
      ? {
        etoId: state.etoId,
        processState: EProcessState.SUCCESS,
        ...action.payload.data
      }
      : state
    }
    case actions.txUserFlowInvestment.reset.getType(): {
      return initialState
    }
    case actions.txUserFlowInvestment.setInvestmentValue.getType(): {
      return state.processState === EProcessState.SUCCESS
        ? {
          ...state,
          investmentValue: action.payload.value
        }
        : state
    }
    case actions.txUserFlowInvestment.setFormState.getType(): {
      return state.processState === EProcessState.SUCCESS
        ? {
          ...state,
          formState: action.payload.formState
        }
        : state
    }
  }

  return state;
};
