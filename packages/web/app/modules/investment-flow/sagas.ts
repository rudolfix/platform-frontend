import BigNumber from "bignumber.js";
import { delay } from "redux-saga";
import { all, call, put, select, take, takeEvery, takeLatest } from "redux-saga/effects";

import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  formatNumber,
  formatThousands,
  selectDecimalPlaces, stripNumberFormatting, toFixedPrecision
} from "../../components/shared/formatters/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { ITxData } from "../../lib/web3/types";
import { IAppState } from "../../store";
import { addBigNumbers, compareBigNumbers, multiplyBigNumbers, subtractBigNumbers } from "../../utils/BigNumberUtils";
import { nonNullable } from "../../utils/nonNullable";
import { convertToUlps } from "../../utils/NumberUtils";
import { extractNumber } from "../../utils/StringUtils";
import { actions, TActionFromCreator } from "../actions";
import {
  selectEtoById,
  selectEtoOnChainStateById,
  selectEtoTokenGeneralDiscounts,
  selectEtoTokenStandardPrice,
  selectEtoWithCompanyAndContractById,
} from "../eto/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContractReadonly } from "../eto/types";
import { selectStandardGasPriceWithOverHead } from "../gas/selectors";
import { loadComputedContributionFromContract } from "../investor-portfolio/sagas";
import {
  selectCalculatedContribution,
  selectCalculatedEtoTicketSizesUlpsById,
  selectEquityTokenCountByEtoId,
  selectHasInvestorTicket,
  selectIsWhitelisted,
  selectNeuRewardUlpsByEtoId,
  selectPersonalDiscount,
} from "../investor-portfolio/selectors";
import { neuCall } from "../sagasUtils";
import { selectEtherPriceEur, selectEurPriceEther } from "../shared/tokenPrice/selectors";
import { selectTxGasCostEthUlps, selectTxSenderModalOpened } from "../tx/sender/selectors";
import { INVESTMENT_GAS_AMOUNT } from "../tx/transactions/investment/sagas";
import { ETxSenderType } from "../tx/types";
import { txValidateSaga } from "../tx/validator/sagas";
import {
  selectICBMLockedEtherBalance,
  selectICBMLockedEtherBalanceEuroAmount,
  selectICBMLockedEuroTokenBalance,
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLiquidEuroTokenBalance,
  selectLockedEtherBalance,
  selectLockedEuroTokenBalance,
  selectNEURStatus,
  selectWalletData,
} from "../wallet/selectors";
import { ENEURWalletStatus } from "../wallet/types";
import { EInvestmentErrorState, EInvestmentType } from "./reducer";
import {
  selectInvestmentErrorState,
  selectInvestmentEthValueUlps,
  selectInvestmentEtoId,
  selectInvestmentEurValueUlps,
  selectInvestmentType,
  selectIsICBMInvestment,
  selectIsInvestmentInputValidated,
  selectIsReadyToInvest,
} from "./selectors";
import { getCurrencyByInvestmentType } from "./utils";
import { selectTxValidationState } from "../tx/validator/selectors";
import {
  createWallets,
  EInvestmentCurrency,
  formatMinMaxTickets,
  getInvestmentCurrency
} from "../../components/modals/tx-sender/investment-flow/utils";
import { isValidFormNumber } from "../tx/validator/transfer/utils";
import { EValidationState } from "../tx/validator/reducer";

function* processCurrencyValue(
  action: TActionFromCreator<typeof actions.investmentFlow.submitCurrencyValue>,
): Iterator<any> {
  const currency = action.payload.currency;

  yield put(actions.txUserFlowInvestment.setInvestmentValue(action.payload.value))

  const value = action.payload.value && convertToUlps(extractNumber(action.payload.value));
  const oldVal =
    currency === ECurrency.ETH
      ? yield select(selectInvestmentEthValueUlps)
      : yield select(selectInvestmentEurValueUlps);

  // stop if value has not changed. allows editing fractions without overriding user input.
  if (compareBigNumbers(oldVal || "0", value || "0") === 0) return;

  console.log("-----processCurrencyValue", value)
  yield put(actions.investmentFlow.setIsInputValidated(false));
  yield computeAndSetCurrencies(value, currency);
  // dispatch in order to debounce, instead of calling directly
  yield put(actions.investmentFlow.validateInputs());

}

function* computeAndSetCurrencies(value: string, currency: ECurrency): any {
  const state: IAppState = yield select();
  const etherPriceEur = selectEtherPriceEur(state);
  const eurPriceEther = selectEurPriceEther(state);
  if (!value) {
    yield put(actions.investmentFlow.setEthValue(""));
    yield put(actions.investmentFlow.setEurValue(""));
  } else if (etherPriceEur && etherPriceEur !== "0") {
    const valueAsBigNumber = new BigNumber(value);
    switch (currency) {
      case ECurrency.ETH:
        const eurVal = valueAsBigNumber.mul(etherPriceEur);
        yield put(
          actions.investmentFlow.setEthValue(valueAsBigNumber.toFixed(0, BigNumber.ROUND_UP)),
        );
        yield put(actions.investmentFlow.setEurValue(eurVal.toFixed(0, BigNumber.ROUND_UP)));
        console.log("computeAndSetCurrencies", valueAsBigNumber.toFixed(0, BigNumber.ROUND_UP), eurVal.toFixed(0, BigNumber.ROUND_UP))
        return;
      case ECurrency.EUR_TOKEN:
        const ethVal = valueAsBigNumber.mul(eurPriceEther);
        yield put(actions.investmentFlow.setEthValue(ethVal.toFixed(0, BigNumber.ROUND_UP)));
        yield put(
          actions.investmentFlow.setEurValue(valueAsBigNumber.toFixed(0, BigNumber.ROUND_UP)),
        );
        return;
    }
  }
}

function* investEntireBalance(): any {
  yield setTransactionWithPresetGas();
  const state: IAppState = yield select();

  const type = selectInvestmentType(state);

  let balance = "";
  switch (type) {
    case EInvestmentType.ICBMEth:
      balance = selectLockedEtherBalance(state);
      yield computeAndSetCurrencies(balance, ECurrency.ETH);
      break;

    case EInvestmentType.ICBMnEuro:
      balance = selectLockedEuroTokenBalance(state);
      yield computeAndSetCurrencies(balance, ECurrency.EUR_TOKEN);
      break;

    case EInvestmentType.NEur:
      balance = selectLiquidEuroTokenBalance(state);
      yield computeAndSetCurrencies(balance, ECurrency.EUR_TOKEN);
      break;

    case EInvestmentType.Eth:
      const gasCostEth = selectTxGasCostEthUlps(state);
      balance = selectLiquidEtherBalance(state);
      balance = subtractBigNumbers([balance, gasCostEth]);
      yield computeAndSetCurrencies(balance, ECurrency.ETH);
      break;
  }

  if (balance) {
    yield put(actions.investmentFlow.validateInputs());
  }
}

function* validateInvestment(): Iterator<any> {

  const etoId = yield select(selectInvestmentEtoId);
  const investmentType = yield select(selectInvestmentType);


  const euroValue = yield select(selectInvestmentEurValueUlps);
  const etherValue = yield select(selectInvestmentEthValueUlps);

  const wallet = yield select(selectWalletData);

  const contribs = yield select(selectCalculatedContribution, etoId);
  const ticketSizes = yield select(selectCalculatedEtoTicketSizesUlpsById, etoId);

  if (!contribs || !euroValue || !wallet || !ticketSizes) return;

  if (investmentType === EInvestmentType.Eth) {
    const gasPrice = yield select(selectTxGasCostEthUlps);
    const etherBalance = yield select(selectLiquidEtherBalance)
    if (
      compareBigNumbers(addBigNumbers([etherValue, gasPrice]), etherBalance) > 0
    ) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (investmentType === EInvestmentType.ICBMnEuro) {
    const lockedEuroTokenBalance = yield select(selectLockedEuroTokenBalance)
    if (compareBigNumbers(euroValue, lockedEuroTokenBalance) > 0) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (investmentType === EInvestmentType.NEur) {
    const liquidEuroTokenBalance = yield select(selectLiquidEuroTokenBalance)
    if (compareBigNumbers(euroValue, liquidEuroTokenBalance) > 0) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (investmentType === EInvestmentType.ICBMEth) {
    const lockedEtherBalance = yield select(selectLockedEtherBalance);
    if (compareBigNumbers(etherValue, lockedEtherBalance) > 0) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (compareBigNumbers(euroValue, ticketSizes.minTicketEurUlps) < 0) {
    return EInvestmentErrorState.BelowMinimumTicketSize;
  }

  if (compareBigNumbers(euroValue, ticketSizes.maxTicketEurUlps) > 0) {
    return EInvestmentErrorState.AboveMaximumTicketSize;
  }

  if (contribs.maxCapExceeded) {
    return EInvestmentErrorState.ExceedsTokenAmount;
  }

  return;
}

function* validateAndCalculateInputs({ contractsService }: TGlobalDependencies): any {
  // debounce validation
  yield delay(300); //fixme !!
  yield put(actions.investmentFlow.setErrorState(undefined));

  const etoId = yield select(selectInvestmentEtoId);
  const eto: TEtoWithCompanyAndContractReadonly | undefined = yield select(selectEtoWithCompanyAndContractById, etoId);
  const value = yield select(selectInvestmentEurValueUlps);

  if (value && eto) {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);
    if (etoContract) {
      const isICBM = yield select(selectIsICBMInvestment);

      const contribution = yield neuCall(loadComputedContributionFromContract, eto, value, isICBM);

      yield put(actions.investorEtoTicket.setCalculatedContribution(etoId, contribution));

      const validationError = yield call(validateInvestment);

      if (validationError) {
        yield put(actions.investmentFlow.setErrorState(validationError));
        yield call(getInvestmentViewData, eto); //fixme
        return
      }

      const txData: ITxData = yield neuCall(
        txValidateSaga,
        actions.txValidator.validateDraft({ type: ETxSenderType.INVEST }),
      );
      yield put(actions.txSender.setTransactionData(txData));

      yield put(actions.investmentFlow.setIsInputValidated(true));


    }
  }
  eto && (yield call(getInvestmentViewData, eto))//fixme
}

function calculateTotalCostIfValid(error, gasCost, value) {
  return error ? null : addBigNumbers([gasCost, value || "0"])
}

function* getInvestmentViewData(
  eto: TEtoWithCompanyAndContractReadonly
) {
  try {
    const wallets = yield call(generateWalletsData);
    const {
      euroValue,
      etherPriceEur,
      eurPriceEther,
      ethValue,
      investmentInputValidated,
      gasCostEthRaw,
      investmentType,
      neuReward,
      equityTokenCount,
      readyToInvest,
      etoTicketSizes,
      hasPreviouslyInvested,
      etoTokenGeneralDiscounts,
      etoTokenPersonalDiscount,
      etoTokenStandardPrice,
      errorState,
      txValidationState
    } = yield all({
      euroValue: select(selectInvestmentEurValueUlps),
      etherPriceEur: select(selectEtherPriceEur),
      eurPriceEther: select(selectEurPriceEther),
      ethValue: select(selectInvestmentEthValueUlps),
      investmentInputValidated: select(selectIsInvestmentInputValidated),
      gasCostEthRaw: select(selectTxGasCostEthUlps),
      investmentType: select(selectInvestmentType),
      neuReward: select(selectNeuRewardUlpsByEtoId, eto.etoId),
      equityTokenCount: select(selectEquityTokenCountByEtoId, eto.etoId),
      readyToInvest: select(selectIsReadyToInvest),
      etoTicketSizes: select(selectCalculatedEtoTicketSizesUlpsById, eto.etoId),
      hasPreviouslyInvested: select(selectHasInvestorTicket, eto.etoId),
      etoTokenGeneralDiscounts: select(selectEtoTokenGeneralDiscounts, eto.etoId),
      etoTokenPersonalDiscount: select(selectPersonalDiscount, eto.etoId),
      etoTokenStandardPrice: select(selectEtoTokenStandardPrice, eto.previewCode),
      errorState: select(selectInvestmentErrorState),
      txValidationState: select(selectTxValidationState),
    });

    const showTokens = !!(euroValue && investmentInputValidated);

    const gasCostEthWithFallback = !ethValue ? "0" : gasCostEthRaw;
    const gasCostEuro = multiplyBigNumbers([gasCostEthWithFallback, etherPriceEur]);

    // TODO: do not cast minTicketEur/maxTicketEur to FLOAT as then we loose precision
    const minTicketEur =
      (etoTicketSizes &&
        etoTicketSizes.minTicketEurUlps &&
        formatMinMaxTickets(etoTicketSizes.minTicketEurUlps, ERoundingMode.UP)) ||
      "0";
    const maxTicketEur =
      (etoTicketSizes &&
        etoTicketSizes.maxTicketEurUlps &&
        formatMinMaxTickets(etoTicketSizes.maxTicketEurUlps, ERoundingMode.DOWN)) ||
      "0";
    const minTicketEth = multiplyBigNumbers([minTicketEur, eurPriceEther])

    const totalCostEth = yield call(calculateTotalCostIfValid, errorState, gasCostEthRaw, ethValue);
    const totalCostEuro = yield call(calculateTotalCostIfValid, errorState, gasCostEuro, euroValue);

    const investmentCurrency = getInvestmentCurrency(investmentType);

    const minEthTicketFormatted = formatNumber({
      value: minTicketEth,
      inputFormat: ENumberInputFormat.FLOAT,
      outputFormat: ENumberOutputFormat.FULL,
      decimalPlaces: selectDecimalPlaces(ECurrency.ETH, ENumberOutputFormat.FULL),
      roundingMode: ERoundingMode.UP,
    });

    const equityTokenCountFormatted = formatThousands(equityTokenCount.toString())
    const euroValueWithFallback = isValidFormNumber(euroValue)
      ? euroValue
      : "0";

    const investmentValue = investmentCurrency === EInvestmentCurrency.ETH
      ? ethValue && toFixedPrecision({
        value: ethValue,
        roundingMode: ERoundingMode.DOWN,
        inputFormat: ENumberInputFormat.ULPS,
        outputFormat: ENumberOutputFormat.FULL,
        decimalPlaces: selectDecimalPlaces(ECurrency.ETH, ENumberOutputFormat.FULL),
      })
      : euroValue && toFixedPrecision({
        value: euroValue,
        roundingMode: ERoundingMode.DOWN,
        inputFormat: ENumberInputFormat.ULPS,
        outputFormat: ENumberOutputFormat.FULL,
        decimalPlaces: selectDecimalPlaces(ECurrency.EUR_TOKEN, ENumberOutputFormat.FULL),
      });

    const onlyErrors =(txValidationState: EValidationState | undefined) => { //fixme!!
      if(txValidationState !== EValidationState.VALIDATION_OK && txValidationState !==  EValidationState.VALIDATING) {
        return txValidationState
      } else {
        return undefined
      }
    };

    console.log("saga errorstate", errorState, investmentValue)

    const error = errorState || onlyErrors(txValidationState)
    const gasCostEth = gasCostEthRaw && !errorState && gasCostEthRaw !== "0"
      ? gasCostEthRaw
      : undefined;

    yield put(actions.txUserFlowInvestment.setData({
      eto,
      investmentValue,
      equityTokenCount,
      gasCostEth,
      gasCostEuro,
      investmentType,
      minTicketEur,
      maxTicketEur,
      neuReward,
      readyToInvest,
      showTokens,
      wallets,
      hasPreviouslyInvested,
      investmentCurrency,
      etoTokenGeneralDiscounts,
      etoTokenPersonalDiscount,
      etoTokenStandardPrice,
      error,
      totalCostEth,
      totalCostEuro,
      minEthTicketFormatted,
      equityTokenCountFormatted,
      euroValueWithFallback,
    }));
  } catch (e) {
    console.log(e) //fixme
  }
}

function* start(
  action: TActionFromCreator<typeof actions.investmentFlow.startInvestment>,
): Iterator<any> {
  console.log("start investment")
  const etoId = action.payload.etoId;
  const eto: TEtoWithCompanyAndContractReadonly = nonNullable(
    yield select(selectEtoWithCompanyAndContractById, etoId),
  );

  yield put(actions.investmentFlow.resetInvestment());
  yield put(actions.investmentFlow.setEtoId(etoId));
  yield put(actions.kyc.kycLoadClientData());
  yield put(actions.investorEtoTicket.loadEtoInvestorTicket(eto));

  yield put(actions.investorEtoTicket.loadTokenPersonalDiscount(eto));
  yield put(actions.eto.loadTokenTerms(eto));

  // wait for discount to be in the state
  yield all([
    take(actions.eto.setTokenGeneralDiscounts),
    take(actions.investorEtoTicket.setTokenPersonalDiscount),
  ]);


  yield put(actions.txTransactions.startInvestment(etoId));

  yield resetTxDataAndValidations();
  yield call(getInvestmentViewData, eto);
  yield take("TX_SENDER_SHOW_MODAL");
  // yield getActiveInvestmentTypes();
}

export function* onInvestmentTxModalHide(): any {
  yield put(actions.investmentFlow.resetInvestment());
}

const hasFunds = (input: string) => {
  return compareBigNumbers(input, "0") > 0
};

function* generateWalletsData(): Iterator<any> {
  const etoId = yield select(selectInvestmentEtoId);
  const etoOnChainState = yield select(selectEtoOnChainStateById, etoId);
  const neurStatus = yield select(selectNEURStatus);
  const userIsWhitelisted = yield select(selectIsWhitelisted, etoId);

  const balanceNEur: string = yield select(selectLiquidEuroTokenBalance);
  const ethBalance: string = yield select(selectLiquidEtherBalance);

  const icbmBalanceNEuro: string = yield select(selectICBMLockedEuroTokenBalance);
  const icbmBalanceEth: string = yield select(selectICBMLockedEtherBalance);
  const lockedBalanceNEuro: string = yield select(selectLockedEuroTokenBalance);
  const lockedBalanceEth: string = yield select(selectLockedEtherBalance);

  const ethBalanceAsEuro: string = yield select(selectLiquidEtherBalanceEuroAmount);
  const icbmBalanceEthAsEuro = yield select(selectICBMLockedEtherBalanceEuroAmount);

  let activeTypes: EInvestmentType[] = []

  if (hasFunds(ethBalance)) {
    activeTypes.unshift(EInvestmentType.Eth);
  }

  // if neur is not restricted because of the us state
  if (hasFunds(balanceNEur) && neurStatus !== ENEURWalletStatus.DISABLED_RESTRICTED_US_STATE) {
    activeTypes.unshift(EInvestmentType.NEur);
  }

  // no regular investment if not whitelisted in pre eto
  if (etoOnChainState === EETOStateOnChain.Whitelist && !userIsWhitelisted) {
    activeTypes = [];
  }

  // only ICBM investment if balance available
  if (hasFunds(lockedBalanceNEuro)) {
    activeTypes.unshift(EInvestmentType.ICBMnEuro);
  }
  if (hasFunds(lockedBalanceEth)) {
    activeTypes.unshift(EInvestmentType.ICBMEth);
  }

  yield put(actions.investmentFlow.setActiveInvestmentTypes(activeTypes));

  // guarantee that current type is inside active types.
  const currentType = yield select(selectInvestmentType);
  console.log("activeTypes", activeTypes, "currentType", currentType)
  if (currentType && !activeTypes.includes(currentType)) {
    yield put(actions.investmentFlow.selectInvestmentType(activeTypes[0]));
  }

  const wallets = createWallets(lockedBalanceNEuro, balanceNEur, icbmBalanceNEuro,
    ethBalance, lockedBalanceEth, icbmBalanceEth, ethBalanceAsEuro, icbmBalanceEthAsEuro, activeTypes);
  return wallets
}

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

function* setTransactionWithPresetGas(): any {
  const gasPrice = yield select(selectStandardGasPriceWithOverHead);

  yield put(
    actions.txSender.setTransactionData({
      gas: INVESTMENT_GAS_AMOUNT,
      value: "",
      to: "",
      from: "",
      gasPrice,
    }),
    // This sets all other irrelevant values into false values.
    // TODO: Refactor the whole transaction flow into a simpler flow that doesn't relay on txData
  );
}

function* resetTxDataAndValidations(): any {
  yield put(actions.txValidator.clearValidationState());
  yield put(actions.txSender.txSenderClearTransactionData());
}

function* stop(): any {
  // TODO: Decouple stop from @@router/LOCATION_CHANGE as txSenderHideModal
  //       is being called on every Router change
  // THIS IS A QUICK FIX
  const isOpen = yield select(selectTxSenderModalOpened);
  if (isOpen) yield put(actions.txSender.txSenderHideModal());
}

export function* investmentFlowSagas(): any {
  yield takeEvery(actions.investmentFlow.submitCurrencyValue, processCurrencyValue);
  yield takeLatest(actions.investmentFlow.validateInputs, neuCall, validateAndCalculateInputs);
  yield takeEvery(actions.investmentFlow.startInvestment, start);
  yield takeEvery("TOKEN_PRICE_SAVE", recalculateCurrencies);
  yield takeEvery(actions.investmentFlow.selectInvestmentType, resetTxDataAndValidations);
  yield takeEvery(actions.investmentFlow.investEntireBalance, investEntireBalance);
  yield takeEvery("@@router/LOCATION_CHANGE", stop); // stop investment if some link is clicked
}
