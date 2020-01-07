import { all, call, select } from "redux-saga/effects";

import { formatThousands } from "../../../../../components/shared/formatters/utils";
import { IGasValidationData } from "../../../../../lib/web3/types";
import { addBigNumbers, multiplyBigNumbers } from "../../../../../utils/BigNumberUtils";
import { convertFromUlps } from "../../../../../utils/NumberUtils";
import {
  selectEquityTokenCountByEtoId,
  selectNeuRewardUlpsByEtoId,
} from "../../../../investor-portfolio/selectors";
import { selectEtherPriceEur, selectEurPriceEther } from "../../../../shared/tokenPrice/selectors";
import { selectTxUserFlowInvestmentState } from "../selectors";
import {
  EInvestmentFormState,
  EInvestmentValueType,
  TInvestmentULPSValuePair,
  TTxUserFlowInvestmentReadyState,
} from "../types";
import { getTicketSizes } from "./getTicketSizes";

export function* calculateInvestmentCostsData(
  investmentValue: string,
  investmentValueType: EInvestmentValueType,
  { euroValueUlps, ethValueUlps }: TInvestmentULPSValuePair,
  txDetails: IGasValidationData,
): Generator<any, any, any> {
  const {
    eto,
    wallets,
    investmentWallet,
    investmentCurrency,
    minTicketEur,
    hasPreviouslyInvested,
    minEthTicketFormatted,
    etoTokenGeneralDiscounts,
    etoTokenPersonalDiscount,
    etoTokenStandardPrice,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const eurPriceEther = yield select(selectEurPriceEther);

  const [gasCostEth, etherPriceEur, equityTokenCount, { maxTicketEur }, neuReward] = yield all([
    call(multiplyBigNumbers, [txDetails.gas, txDetails.gasPrice]),
    select(selectEtherPriceEur),
    select(selectEquityTokenCountByEtoId, eto.etoId),
    call(getTicketSizes, { eto, euroValueUlps: "0", investmentWallet, eurPriceEther }),
    select(selectNeuRewardUlpsByEtoId, eto.etoId),
  ]);

  const [equityTokenCountFormatted, euroValueWithFallback, gasCostEuro] = yield all([
    call(formatThousands, equityTokenCount.toString()),
    call(convertFromUlps, euroValueUlps),
    call(multiplyBigNumbers, [gasCostEth, etherPriceEur]),
  ]);

  const [totalCostEth, totalCostEuro] = yield all([
    addBigNumbers([gasCostEth, ethValueUlps]),
    addBigNumbers([gasCostEuro, euroValueUlps]),
  ]);

  return {
    formState: EInvestmentFormState.VALID,
    investmentValue,
    investmentValueType,
    eto,
    wallets,
    investmentWallet,
    investmentCurrency,
    minTicketEur,
    hasPreviouslyInvested,
    minEthTicketFormatted,

    euroValueWithFallback,
    gasCostEth,
    maxTicketEur,
    neuReward,
    etoTokenGeneralDiscounts,
    etoTokenPersonalDiscount,
    etoTokenStandardPrice,
    equityTokenCountFormatted,

    gasCostEuro,
    totalCostEth,
    totalCostEuro,
  };
}
