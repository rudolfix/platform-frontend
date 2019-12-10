import { WalletSelectionData } from "../../../../components/modals/tx-sender/investment-flow/InvestmentTypeSelector";
import { AppReducer } from "../../../../store";
import { DeepReadonly } from "../../../../types";
import { EProcessState } from "../../../../utils/enums/processStates";
import { actions } from "../../../actions";
import { IEtoTokenGeneralDiscounts, TEtoWithCompanyAndContractReadonly } from "../../../eto/types";
import { IPersonalDiscount } from "../../../investor-portfolio/types";
import { EValidationState } from "../../validator/reducer";

export enum EInvestmentCurrency {
  ETH = "ETH",
  EUR_TOKEN = "EUR_TOKEN",
}

export enum EInvestmentFormState {
  EMPTY = "empty",
  VALIDATING = "VALIDATING",
  VALID = "valid",
  INVALID = "invalid",
}

export enum EInputValidationError {
  IS_EMPTY = "isEmpty",
  NOT_A_NUMBER = "notANumber",
}

export enum EInvestmentValueType {
  FULL_BALANCE = "fullBalance",
  PARTIAL_BALANCE = "partialBalance",
}

export enum EInvestmentType {
  Eth = "ETH",
  NEur = "NEUR",
  ICBMEth = "ICBM_ETH",
  ICBMnEuro = "ICBM_NEUR",
}

export enum EInvestmentErrorState {
  AboveMaximumTicketSize = "above_maximum_ticket_size",
  BelowMinimumTicketSize = "below_minimum_ticket_size",
  ExceedsTokenAmount = "exceeds_token_amount",
  ExceedsWalletBalance = "exceeds_wallet_balance",
}

export type TValidationError =
  | EInputValidationError
  | EInvestmentErrorState
  | EValidationState.NOT_ENOUGH_ETHER_FOR_GAS;

export type TTxUserFlowInvestmentBasicData = {
  eto: TEtoWithCompanyAndContractReadonly;
  wallets: DeepReadonly<WalletSelectionData[]>;
  investmentValue: string;
  euroValueWithFallback: string;
  investmentType: EInvestmentType;
  investmentCurrency: EInvestmentCurrency;
  totalCostEth: string;
  totalCostEuro: string;
  hasPreviouslyInvested: boolean;
  minTicketEur: string;
  minEthTicketFormatted: string;
  investmentValueType: EInvestmentValueType;
};

export type TTxUserFlowInvestmentErrorData = {
  error: TValidationError;
};

export type TTxUserFlowInvestmentCalculatedCostsData = {
  gasCostEth: string;
  gasCostEuro: string;
  maxTicketEur: string;
  neuReward: string;
  etoTokenGeneralDiscounts: IEtoTokenGeneralDiscounts;
  etoTokenPersonalDiscount: IPersonalDiscount;
  etoTokenStandardPrice: string;
  equityTokenCountFormatted: string;
};

export type TTxUserFlowInvestmentViewData =
  | ({
      formState: EInvestmentFormState.EMPTY | EInvestmentFormState.VALIDATING;
    } & TTxUserFlowInvestmentBasicData)
  | ({
      formState: EInvestmentFormState.INVALID | EInvestmentFormState.VALIDATING;
    } & TTxUserFlowInvestmentBasicData &
      TTxUserFlowInvestmentErrorData)
  | ({
      formState: EInvestmentFormState.VALID | EInvestmentFormState.VALIDATING;
    } & TTxUserFlowInvestmentBasicData &
      TTxUserFlowInvestmentCalculatedCostsData);

export type TTxUserFlowInvestmentReadyState = { processState: EProcessState.SUCCESS } & {
  etoId: string;
} & TTxUserFlowInvestmentViewData;

export type TTxUserFlowInvestmentInProgressState = {
  processState: EProcessState.ERROR | EProcessState.IN_PROGRESS;
} & { etoId: string };

export type TTxUserFlowInvestmentState =
  | { processState: EProcessState.NOT_STARTED }
  | TTxUserFlowInvestmentInProgressState
  | TTxUserFlowInvestmentReadyState;

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
