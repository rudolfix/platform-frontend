import { all, call, put, select } from "@neufund/sagas";
import BigNumber from "bignumber.js";

import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { convertToUlps } from "../../../../../utils/NumberUtils";
import { actions } from "../../../../actions";
import { selectEquityTokenCountByEtoId } from "../../../../investor-portfolio/selectors";
import { neuCall } from "../../../../sagasUtils";
import { selectEtherPriceEur } from "../../../../shared/tokenPrice/selectors";
import { generateInvestmentTransaction } from "../../../transactions/investment/sagas";
import { isEthInvestment } from "../../../transactions/investment/selectors";
import { selectTxUserFlowInvestmentState } from "../selectors";
import { TTxUserFlowInvestmentBasicData, TTxUserFlowInvestmentCalculatedCostsData } from "../types";
import { isIcbmInvestment } from "../utils";
import { computeCurrencies } from "./computeCurrencies";

export function* submitInvestment({ logger }: TGlobalDependencies): Generator<any, any, any> {
  const {
    investmentValueType,
    investmentCurrency,
    investmentWallet,
    investmentValue,
    eto,
    gasCostEth,
    neuReward,
  }: TTxUserFlowInvestmentBasicData & TTxUserFlowInvestmentCalculatedCostsData = yield select(
    selectTxUserFlowInvestmentState,
  );

  const {
    values: { euroValueUlps, ethValueUlps },
    isIcbm,
    equityTokens,
    etherPriceEur,
  } = yield all({
    values: call(computeCurrencies, convertToUlps(investmentValue), investmentCurrency),
    isIcbm: call(isIcbmInvestment, investmentWallet),
    equityTokens: select(selectEquityTokenCountByEtoId, eto.etoId),
    etherPriceEur: select(selectEtherPriceEur),
  });

  if (!eto.investmentCalculatedValues) {
    logger.error("ETO investment calculated values are empty");
    throw new Error("ETO investment calculated values are empty");
  }

  const transactionData = yield neuCall(generateInvestmentTransaction, {
    investmentValueType,
    investmentWallet,
    etoId: eto.etoId,
    investAmountUlps: new BigNumber(
      isEthInvestment(investmentWallet) ? ethValueUlps : euroValueUlps,
    ),
  });

  const additionalData = {
    eto: {
      etoId: eto.etoId,
      companyName: eto.company.name,
      equityTokensPerShare: eto.equityTokensPerShare,
      sharePrice: eto.investmentCalculatedValues.sharePrice,
      equityTokenInfo: {
        equityTokenSymbol: eto.equityTokenSymbol,
        equityTokenImage: eto.equityTokenImage,
        equityTokenName: eto.equityTokenName,
      },
    },
    investmentEth: ethValueUlps,
    investmentEur: euroValueUlps,
    gasCostEth,
    equityTokens,
    estimatedReward: neuReward,
    etherPriceEur,
    isIcbm,
  };

  yield put(actions.txUserFlowInvestment.submitTransaction(transactionData, additionalData));
}
