import { all, call, put, select } from "redux-saga/effects";

import { TEtoSpecsData } from "../../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { addBigNumbers, compareBigNumbers } from "../../../../../utils/BigNumberUtils";
import { actions } from "../../../../actions";
import { loadComputedContributionFromContract } from "../../../../investor-portfolio/sagas";
import { neuCall } from "../../../../sagasUtils";
import {
  selectLiquidEtherBalance,
  selectLiquidEuroTokenBalance,
  selectLockedEtherBalance,
  selectLockedEuroTokenBalance,
  selectWalletData,
} from "../../../../wallet/selectors";
import { selectTxGasCostEthUlps } from "../../../sender/selectors";
import { selectTxUserFlowInvestmentState } from "../selectors";
import {
  EInvestmentErrorState,
  EInvestmentType,
  TInvestmentULPSValuePair,
  TTxUserFlowInvestmentReadyState,
} from "../types";
import { isIcbmInvestment } from "../utils";
import { getCalculatedContribution } from "./getCalculatedContribution";

export function* validateInvestmentLimits({
  euroValueUlps,
  ethValueUlps,
}: TInvestmentULPSValuePair): Generator<any, any, any> {
  const { etoId, investmentType, eto }: TTxUserFlowInvestmentReadyState = yield select(
    selectTxUserFlowInvestmentState,
  );

  const isICBM = yield call(isIcbmInvestment, investmentType);
  const contribution = yield neuCall(
    loadComputedContributionFromContract,
    eto as TEtoSpecsData,
    euroValueUlps,
    isICBM,
  );
  yield put(actions.investorEtoTicket.setCalculatedContribution(etoId, contribution));

  const [wallet, ticketSizes] = yield all([
    select(selectWalletData),
    call(getCalculatedContribution, { eto, euroValueUlps, investmentType }),
  ]);

  if (!contribution || !euroValueUlps || !wallet || !ticketSizes) return;

  if (investmentType === EInvestmentType.Eth) {
    const [gasPrice, etherBalance] = yield all([
      select(selectTxGasCostEthUlps),
      select(selectLiquidEtherBalance),
    ]);
    if (compareBigNumbers(addBigNumbers([ethValueUlps, gasPrice]), etherBalance) > 0) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (investmentType === EInvestmentType.ICBMnEuro) {
    const lockedEuroTokenBalance = yield select(selectLockedEuroTokenBalance);
    if (compareBigNumbers(euroValueUlps, lockedEuroTokenBalance) > 0) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (investmentType === EInvestmentType.NEur) {
    const liquidEuroTokenBalance = yield select(selectLiquidEuroTokenBalance);
    if (compareBigNumbers(euroValueUlps, liquidEuroTokenBalance) > 0) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (investmentType === EInvestmentType.ICBMEth) {
    const lockedEtherBalance = yield select(selectLockedEtherBalance);
    if (compareBigNumbers(ethValueUlps, lockedEtherBalance) > 0) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (compareBigNumbers(euroValueUlps, ticketSizes.minTicketEurUlps) < 0) {
    return EInvestmentErrorState.BelowMinimumTicketSize;
  }

  if (compareBigNumbers(euroValueUlps, ticketSizes.maxTicketEurUlps) > 0) {
    return EInvestmentErrorState.AboveMaximumTicketSize;
  }

  if (contribution.maxCapExceeded) {
    return EInvestmentErrorState.ExceedsTokenAmount;
  }

  return;
}
