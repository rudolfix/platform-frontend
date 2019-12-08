import BigNumber from "bignumber.js";
import { delay } from "redux-saga";
import { all, call, put, select, take, takeEvery, takeLatest } from "redux-saga/effects";

import {
  ECurrency,
} from "../../components/shared/formatters/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { ITxData } from "../../lib/web3/types";
import { IAppState } from "../../store";
import { addBigNumbers, compareBigNumbers, subtractBigNumbers } from "../../utils/BigNumberUtils";
import { nonNullable } from "../../utils/nonNullable";
import { convertToUlps } from "../../utils/NumberUtils";
import { extractNumber } from "../../utils/StringUtils";
import { actions, TActionFromCreator } from "../actions";
import {
  selectEtoWithCompanyAndContractById,
} from "../eto/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../eto/types";
import { selectStandardGasPriceWithOverHead } from "../gas/selectors";
import { loadComputedContributionFromContract } from "../investor-portfolio/sagas";
import {
  selectCalculatedContribution,
  selectCalculatedEtoTicketSizesUlpsById,
} from "../investor-portfolio/selectors";
import { neuCall } from "../sagasUtils";
import { selectEtherPriceEur, selectEurPriceEther } from "../shared/tokenPrice/selectors";
import { selectTxGasCostEthUlps, selectTxSenderModalOpened } from "../tx/sender/selectors";
import { INVESTMENT_GAS_AMOUNT } from "../tx/transactions/investment/sagas";
import { ETxSenderType } from "../tx/types";
import { txValidateSaga } from "../tx/validator/sagas";
import {
  selectLiquidEtherBalance,
  selectLiquidEuroTokenBalance,
  selectLockedEtherBalance,
  selectLockedEuroTokenBalance,
  selectWalletData,
} from "../wallet/selectors";
import { EInvestmentErrorState, EInvestmentType } from "./reducer";
import {
  selectInvestmentEthValueUlps,
  selectInvestmentEtoId,
  selectInvestmentEurValueUlps,
  selectInvestmentType,
  selectIsICBMInvestment,
} from "./selectors";
import { getCurrencyByInvestmentType } from "./utils";
import { getInvestmentInitViewData } from "../tx/user-flow/investment/sagas";

// function* processCurrencyValue(
//   action: TActionFromCreator<typeof actions.investmentFlow.submitCurrencyValue>,
// ): Iterator<any> {
//   const currency = action.payload.currency;
//
//   yield put(actions.txUserFlowInvestment.setInvestmentValue(action.payload.value));//fixme
//
//   const value = action.payload.value && convertToUlps(extractNumber(action.payload.value));
//   const oldVal =
//     currency === ECurrency.ETH
//       ? yield select(selectInvestmentEthValueUlps)
//       : yield select(selectInvestmentEurValueUlps);
//
//   // stop if value has not changed. allows editing fractions without overriding user input.
//   if (compareBigNumbers(oldVal || "0", value || "0") === 0) return;
//
//   console.log("-----processCurrencyValue", value)
//   yield put(actions.investmentFlow.setIsInputValidated(false));
//   yield computeAndSetCurrencies(value, currency);
//   // dispatch in order to debounce, instead of calling directly
//   yield put(actions.investmentFlow.validateInputs());
//
// }

// function* computeAndSetCurrencies(value: string, currency: ECurrency): any {
//   const state: IAppState = yield select();
//   const etherPriceEur = selectEtherPriceEur(state);
//   const eurPriceEther = selectEurPriceEther(state);
//   if (!value) {
//     yield put(actions.investmentFlow.setEthValue(""));
//     yield put(actions.investmentFlow.setEurValue(""));
//   } else if (etherPriceEur && etherPriceEur !== "0") {
//     const valueAsBigNumber = new BigNumber(value);
//     switch (currency) {
//       case ECurrency.ETH:
//         const eurVal = valueAsBigNumber.mul(etherPriceEur);
//         yield put(
//           actions.investmentFlow.setEthValue(valueAsBigNumber.toFixed(0, BigNumber.ROUND_UP)),
//         );
//         yield put(actions.investmentFlow.setEurValue(eurVal.toFixed(0, BigNumber.ROUND_UP)));
//         console.log("computeAndSetCurrencies", valueAsBigNumber.toFixed(0, BigNumber.ROUND_UP), eurVal.toFixed(0, BigNumber.ROUND_UP))
//         return;
//       case ECurrency.EUR_TOKEN:
//         const ethVal = valueAsBigNumber.mul(eurPriceEther);
//         yield put(actions.investmentFlow.setEthValue(ethVal.toFixed(0, BigNumber.ROUND_UP)));
//         yield put(
//           actions.investmentFlow.setEurValue(valueAsBigNumber.toFixed(0, BigNumber.ROUND_UP)),
//         );
//         return;
//     }
//   }
// }

// function* investEntireBalance(): any {
//   yield setTransactionWithPresetGas();
//   const state: IAppState = yield select();
//
//   const type = selectInvestmentType(state);
//
//   let balance = "";
//   switch (type) {
//     case EInvestmentType.ICBMEth:
//       balance = selectLockedEtherBalance(state);
//       yield computeAndSetCurrencies(balance, ECurrency.ETH);
//       break;
//
//     case EInvestmentType.ICBMnEuro:
//       balance = selectLockedEuroTokenBalance(state);
//       yield computeAndSetCurrencies(balance, ECurrency.EUR_TOKEN);
//       break;
//
//     case EInvestmentType.NEur:
//       balance = selectLiquidEuroTokenBalance(state);
//       yield computeAndSetCurrencies(balance, ECurrency.EUR_TOKEN);
//       break;
//
//     case EInvestmentType.Eth:
//       const gasCostEth = selectTxGasCostEthUlps(state);
//       balance = selectLiquidEtherBalance(state);
//       balance = subtractBigNumbers([balance, gasCostEth]);
//       yield computeAndSetCurrencies(balance, ECurrency.ETH);
//       break;
//   }
//
//   if (balance) {
//     yield put(actions.investmentFlow.validateInputs());
//   }
// }

// function* validateInvestment(): Iterator<any> {
//
//   const etoId = yield select(selectInvestmentEtoId);
//   const investmentType = yield select(selectInvestmentType);
//
//
//   const euroValue = yield select(selectInvestmentEurValueUlps);
//   const etherValue = yield select(selectInvestmentEthValueUlps);
//
//   const wallet = yield select(selectWalletData);
//
//   const contribs = yield select(selectCalculatedContribution, etoId);
//   const ticketSizes = yield select(selectCalculatedEtoTicketSizesUlpsById, etoId);
//
//   if (!contribs || !euroValue || !wallet || !ticketSizes) return;
//
//   if (investmentType === EInvestmentType.Eth) {
//     const gasPrice = yield select(selectTxGasCostEthUlps);
//     const etherBalance = yield select(selectLiquidEtherBalance);
//     if (
//       compareBigNumbers(addBigNumbers([etherValue, gasPrice]), etherBalance) > 0
//     ) {
//       return EInvestmentErrorState.ExceedsWalletBalance;
//     }
//   }
//
//   if (investmentType === EInvestmentType.ICBMnEuro) {
//     const lockedEuroTokenBalance = yield select(selectLockedEuroTokenBalance);
//     if (compareBigNumbers(euroValue, lockedEuroTokenBalance) > 0) {
//       return EInvestmentErrorState.ExceedsWalletBalance;
//     }
//   }
//
//   if (investmentType === EInvestmentType.NEur) {
//     const liquidEuroTokenBalance = yield select(selectLiquidEuroTokenBalance);
//     if (compareBigNumbers(euroValue, liquidEuroTokenBalance) > 0) {
//       return EInvestmentErrorState.ExceedsWalletBalance;
//     }
//   }
//
//   if (investmentType === EInvestmentType.ICBMEth) {
//     const lockedEtherBalance = yield select(selectLockedEtherBalance);
//     if (compareBigNumbers(etherValue, lockedEtherBalance) > 0) {
//       return EInvestmentErrorState.ExceedsWalletBalance;
//     }
//   }
//
//   if (compareBigNumbers(euroValue, ticketSizes.minTicketEurUlps) < 0) {
//     return EInvestmentErrorState.BelowMinimumTicketSize;
//   }
//
//   if (compareBigNumbers(euroValue, ticketSizes.maxTicketEurUlps) > 0) {
//     return EInvestmentErrorState.AboveMaximumTicketSize;
//   }
//
//   if (contribs.maxCapExceeded) {
//     return EInvestmentErrorState.ExceedsTokenAmount;
//   }
//
//   return;
// }

// function* validateAndCalculateInputs({ contractsService }: TGlobalDependencies): any {
//   // debounce validation
//   yield delay(300); //fixme !!
//   yield put(actions.investmentFlow.setErrorState(undefined));
//
//   const etoId = yield select(selectInvestmentEtoId);
//   const eto: TEtoWithCompanyAndContractReadonly | undefined = yield select(selectEtoWithCompanyAndContractById, etoId);
//   const value = yield select(selectInvestmentEurValueUlps);
//
//   if (value && eto) {
//     const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);
//     if (etoContract) {
//       const isICBM = yield select(selectIsICBMInvestment);
//
//       const contribution = yield neuCall(loadComputedContributionFromContract, eto, value, isICBM);
//
//       yield put(actions.investorEtoTicket.setCalculatedContribution(etoId, contribution));
//
//       const validationError = yield call(validateInvestment);
//
//       if (validationError) {
//         yield put(actions.investmentFlow.setErrorState(validationError));
//         return
//       }
//
//       const txData: ITxData = yield neuCall(
//         txValidateSaga,
//         actions.txValidator.validateDraft({ type: ETxSenderType.INVEST }),
//       );
//       yield put(actions.txSender.setTransactionData(txData));
//
//       yield put(actions.investmentFlow.setIsInputValidated(true));
//
//
//     }
//   }
// }

// function* start(
//   action: TActionFromCreator<typeof actions.investmentFlow.startInvestment>,
// ): Iterator<any> {
//   console.log("start investment")
//   const etoId = action.payload.etoId;
//   const eto: TEtoWithCompanyAndContractReadonly = nonNullable(
//     yield select(selectEtoWithCompanyAndContractById, etoId),
//   );
//
//   yield put(actions.investmentFlow.resetInvestment());
//   yield put(actions.investmentFlow.setEtoId(etoId));
//   yield put(actions.kyc.kycLoadStatusAndData());
//   yield put(actions.investorEtoTicket.loadEtoInvestorTicket(eto));
//
//   yield put(actions.investorEtoTicket.loadTokenPersonalDiscount(eto));
//   yield put(actions.eto.loadTokenTerms(eto));
//
//   // wait for discount to be in the state
//   yield all([
//     take(actions.eto.setTokenGeneralDiscounts),
//     take(actions.investorEtoTicket.setTokenPersonalDiscount),
//   ]);
//
//
//   yield put(actions.txTransactions.startInvestment(etoId));
//
//   yield resetTxDataAndValidations();
//   // yield take("TX_SENDER_SHOW_MODAL");
// }

// export function* onInvestmentTxModalHide(): any {
//   yield put(actions.investmentFlow.resetInvestment());
// }

function* recalculateCurrencies(): any {
  yield delay(100); // wait for new token price to be available
  const s: IAppState = yield select();
  const type = selectInvestmentType(s);

  if (type === undefined) {
    throw new Error("Investment Type can't undefined at this moment");
  }

  const curr = getCurrencyByInvestmentType(type);
  const ethVal = selectInvestmentEthValueUlps(s);
  const eurVal = selectInvestmentEurValueUlps(s);

  if (curr === ECurrency.ETH && ethVal) {
    yield computeAndSetCurrencies(ethVal, curr);
  } else if (eurVal) {
    yield computeAndSetCurrencies(eurVal, curr);
  }
}

// function* setTransactionWithPresetGas(): any {
//   const gasPrice = yield select(selectStandardGasPriceWithOverHead);
//
//   yield put(
//     actions.txSender.setTransactionData({
//       gas: INVESTMENT_GAS_AMOUNT,
//       value: "",
//       to: "",
//       from: "",
//       gasPrice,
//     }),
//     // This sets all other irrelevant values into false values.
//     // TODO: Refactor the whole transaction flow into a simpler flow that doesn't relay on txData
//   );
// }

// function* resetTxDataAndValidations(): any {
//   yield put(actions.txValidator.clearValidationState());
//   yield put(actions.txSender.txSenderClearTransactionData());
// }

function* stop(): any {
  // TODO: Decouple stop from @@router/LOCATION_CHANGE as txSenderHideModal
  //       is being called on every Router change
  // THIS IS A QUICK FIX
  const isOpen = yield select(selectTxSenderModalOpened);
  if (isOpen) yield put(actions.txSender.txSenderHideModal());
}

export function* investmentFlowSagas(): any {
  // yield takeEvery(actions.investmentFlow.submitCurrencyValue, processCurrencyValue);
  // yield takeLatest(actions.investmentFlow.validateInputs, neuCall, validateAndCalculateInputs);
  // yield takeEvery(actions.investmentFlow.startInvestment, start);
  yield takeEvery("TOKEN_PRICE_SAVE", recalculateCurrencies);
  // yield takeEvery(actions.investmentFlow.selectInvestmentType, resetTxDataAndValidations);
  // yield takeEvery(actions.investmentFlow.investEntireBalance, investEntireBalance);
  yield takeEvery("@@router/LOCATION_CHANGE", stop); // stop investment if some link is clicked
}
