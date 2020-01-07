import { WalletSelectionData } from "../../../../components/modals/tx-sender/investment-flow/InvestmentTypeSelector";
import { TMessage } from "../../../../components/translatedMessages/utils";
import { ITxData } from "../../../../lib/web3/types";
import { DeepReadonly } from "../../../../types";
import { EProcessState } from "../../../../utils/enums/processStates";
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

export enum EInvestmentWallet {
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
  investmentWallet: EInvestmentWallet;
  investmentCurrency: EInvestmentCurrency;
  totalCostEth: string;
  totalCostEuro: string;
  hasPreviouslyInvested: boolean;
  minTicketEur: string;
  minTicketEth: string;
  minEthTicketFormatted: string;
  investmentValueType: EInvestmentValueType;
  etoTokenGeneralDiscounts: IEtoTokenGeneralDiscounts;
  etoTokenPersonalDiscount: IPersonalDiscount;
  etoTokenStandardPrice: string;
};

export type TTxUserFlowInvestmentErrorData = {
  error: TMessage;
};

export type TTxUserFlowInvestmentCalculatedCostsData = {
  gasCostEth: string;
  gasCostEuro: string;
  maxTicketEur: string;
  neuReward: string;
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

export type TInvestmentULPSValuePair = {
  euroValueUlps: string;
  ethValueUlps: string;
};

export type TInvestmentValidationResult = {
  validationError: TValidationError | null;
  investmentDetails: {
    investmentTransaction: ITxData;
    euroValueUlps: string;
    ethValueUlps: string;
  };
};
