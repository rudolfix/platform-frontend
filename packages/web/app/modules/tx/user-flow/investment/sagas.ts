import { all, call, fork, put, select, take } from "redux-saga/effects";
import { takeLatest } from "redux-saga";

import { actions, TActionFromCreator } from "../../../actions";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { selectTxUserFlowInvestmentEtoId, selectTxUserFlowInvestmentState } from "./selectors";
import { EProcessState } from "../../../../utils/enums/processStates";
import { EETOStateOnChain, TEtoWithCompanyAndContractReadonly } from "../../../eto/types";
import { selectInvestmentEtoId, } from "../../../investment-flow/selectors";
import { selectEtherPriceEur, selectEurPriceEther } from "../../../shared/tokenPrice/selectors";
import { selectTxGasCostEthUlps } from "../../sender/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectHasInvestorTicket,
  selectInvestorTicket,
  selectIsWhitelisted,
  selectNeuRewardUlpsByEtoId,
  selectPersonalDiscount
} from "../../../investor-portfolio/selectors";
import {
  selectEtoOnChainStateById,
  selectEtoTokenGeneralDiscounts,
  selectEtoTokenStandardPrice,
  selectEtoWithCompanyAndContractById
} from "../../../eto/selectors";
import {
  addBigNumbers,
  compareBigNumbers,
  multiplyBigNumbers,
  subtractBigNumbers
} from "../../../../utils/BigNumberUtils";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  formatNumber,
  formatThousands,
  isEmptyValue,
  parseInputToNumber,
  selectDecimalPlaces
} from "../../../../components/shared/formatters/utils";
import { EValidationState } from "../../validator/reducer";
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
  selectWalletData
} from "../../../wallet/selectors";
import { EInvestmentErrorState, EInvestmentType } from "../../../investment-flow/reducer";
import { ENEURWalletStatus } from "../../../wallet/types";
import { nonNullable } from "../../../../utils/nonNullable";
import {
  EInputValidationError,
  EInvestmentCurrency,
  EInvestmentFormState,
  EInvestmentValueType,
  TTxUserFlowInvestmentBasicData,
  TTxUserFlowInvestmentCalculatedCostsData,
  TTxUserFlowInvestmentReadyState,
  TValidationError,
} from "./reducer";
import BigNumber from "bignumber.js";
import { loadComputedContributionFromContract } from "../../../investor-portfolio/sagas";
import { validateGas } from "../../validator/sagas";
import { convertFromUlps, convertToUlps } from "../../../../utils/NumberUtils";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { generateInvestmentTransaction, INVESTMENT_GAS_AMOUNT } from "../../transactions/investment/sagas";
import { isEthInvestment } from "../../transactions/investment/selectors";
import { IGasValidationData, ITxData } from "../../../../lib/web3/types";
import { NotEnoughEtherForGasError } from "../../../../lib/web3/Web3Adapter";
import {
  calculateTicketLimitsUlps,
  createWallets,
  formatMinMaxTickets,
  getInvestmentCurrency,
  getInvestmentType,
  hasFunds,
  isIcbmInvestment, mapInvestmentCurrency
} from "./utils";
import { WalletSelectionData } from "../../../../components/modals/tx-sender/investment-flow/InvestmentTypeSelector";

export type TInvestmentValidationResult = {
  validationError: TValidationError | null
  investmentDetails: { investmentGasData: IGasValidationData, euroValueUlps: string, ethValueUlps: string }
}

export type TInvestmentULPSValuePair = {
  euroValueUlps: string,
  ethValueUlps: string
}

export type TValidateInvestmentValueInput = {
  value: string,
  investmentCurrency: EInvestmentCurrency,
  investmentType: EInvestmentType,
  etoId: string,
  investmentValueType: EInvestmentValueType
}

function* initInvestmentView(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txUserFlowInvestment.startInvestment>
) {
  console.log("initInvestmentView")
  try {
    //start the tx sagas and wait until txSendProcess opens the modal. This is for backwards compatibility
    //todo refactor transaction flow to not deal with modals and UI in general
    yield put(actions.txTransactions.startInvestment(payload.etoId));
    yield take(actions.txSender.txSenderShowModal);

    const { processState } = yield select(selectTxUserFlowInvestmentState);

    if (processState === EProcessState.NOT_STARTED) {
      yield put(actions.txUserFlowInvestment.setEtoId(payload.etoId));
      const initialViewData = yield neuCall(getInvestmentInitViewData);
      yield put(actions.txUserFlowInvestment.setViewData(initialViewData));
    }
  } catch (e) {
    console.log(e)
  }
}

function* updateInvestmentView(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txUserFlowInvestment.updateValue>
) {
  console.log("---updateInvestmentView", payload.value)
  try {
    const {
      investmentCurrency,
      investmentValue: oldValue,
      investmentType,
      etoId
    }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

    if (payload.value === oldValue) {
      //no need to continue
      return
    } else {
      // many api calls ahead, set Investment Value to show it in the UI in the meantime
      yield all([
        put(actions.txUserFlowInvestment.setInvestmentValue(payload.value)),
        put(actions.txUserFlowInvestment.setFormStateValidating()),
      ]);

      const validationResult = yield call(validateInvestmentValue,
        {
          value: payload.value,
          investmentCurrency,
          investmentType,
          etoId,
          investmentValueType: EInvestmentValueType.PARTIAL_BALANCE
        });

      console.log("---updateInvestmentView validationResult", validationResult)
      const investmentCalculatedData = yield call(generateUpdatedView, validationResult, EInvestmentValueType.PARTIAL_BALANCE, payload.value);
      yield put(actions.txUserFlowInvestment.setViewData(investmentCalculatedData));
    }
  console.log("---updateInvestmentView done")
  } catch(e){
    console.log("updateInvestmentView", e)
  }
}

function* recalculateView() {
  const {
    formState,
    investmentValue,
    investmentCurrency,
    investmentType,
    etoId,
    investmentValueType
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  //recalculate only if there's user has entered any data in the form.
  if (formState === EInvestmentFormState.INVALID || formState === EInvestmentFormState.VALID) {
    yield put(actions.txUserFlowInvestment.setFormStateValidating());

    const validationResult = yield call(validateInvestmentValue,
      {
        value: investmentValue,
        investmentCurrency,
        investmentType,
        etoId,
        investmentValueType
      });

    const viewData = yield call(generateUpdatedView, validationResult, investmentValueType, investmentValue);
    yield put(actions.txUserFlowInvestment.setViewData(viewData));
  }
}

function* cleanupInvestmentView() {
  yield put(actions.txUserFlowInvestment.reset())
}

function* validateInvestmentValue({
  value,
  investmentCurrency,
  investmentType,
  etoId,
  investmentValueType
}: TValidateInvestmentValueInput) {
  const isEmpty = yield isEmptyValue(value);
  if (isEmpty) {
    return { validationError: EInputValidationError.IS_EMPTY, txDetails: null }
  }

  const isAValidNumber = yield parseInputToNumber(value);
  if (!isAValidNumber) {
    return { validationError: EInputValidationError.NOT_A_NUMBER, txDetails: null }
  }

  const investmentValueUlps = yield call(convertToUlps, value);
  const { euroValueUlps, ethValueUlps } = yield call(computeCurrencies, investmentValueUlps, investmentCurrency);
  const validationError: EInvestmentErrorState | undefined = yield call(validateInvestmentLimits, {
    euroValueUlps,
    ethValueUlps
  });
  if (validationError) {
    return { validationError: validationError, txDetails: null }
  }

  const investmentGasData = investmentValueType === EInvestmentValueType.FULL_BALANCE
    ? yield generateInvestmentTransactionWithPresetGas()
    : yield neuCall(generateInvestmentTransaction, {
      investmentType,
      etoId,
      investAmountUlps: new BigNumber(isEthInvestment(investmentType) ? ethValueUlps : euroValueUlps),
    });
  const txValidationResult = yield call(validateTxGas, investmentGasData);

  if (txValidationResult !== EValidationState.VALIDATION_OK) {
    return { validationError: txValidationResult, txDetails: null }
  } else {
    return { validationError: null, investmentDetails: { investmentGasData, euroValueUlps, ethValueUlps } }
  }
}

function* generateUpdatedView(
  validationResult: TInvestmentValidationResult,
  investmentValueType: EInvestmentValueType,
  value: string
) {
  const { validationError, investmentDetails } = validationResult;

  if (validationError !== null) {
    switch (validationError) {
      case EInputValidationError.IS_EMPTY: {
        return yield call(reinitInvestmentView);
      }
      case EInputValidationError.NOT_A_NUMBER: {
        return yield yield call(populateInvalidViewData, value, EInputValidationError.NOT_A_NUMBER);
      }
      case EInvestmentErrorState.AboveMaximumTicketSize:
      case EInvestmentErrorState.BelowMinimumTicketSize:
      case EInvestmentErrorState.ExceedsTokenAmount:
      case EInvestmentErrorState.ExceedsWalletBalance:
      case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS: {
        return yield yield call(populateInvalidViewData, value, validationError);
      }
    }
  } else {
    const { investmentGasData, euroValueUlps, ethValueUlps } = investmentDetails;
    return yield call(calculateInvestmentCostsData, value, investmentValueType, {
      euroValueUlps,
      ethValueUlps
    }, investmentGasData);
  }
}

function* submitInvestment(
  { logger }: TGlobalDependencies
) {
  const {
    investmentCurrency,
    investmentType,
    investmentValue,
    eto,
    gasCostEth,
    neuReward,
  }: TTxUserFlowInvestmentBasicData & TTxUserFlowInvestmentCalculatedCostsData = yield select(selectTxUserFlowInvestmentState);

  const {
    values: { euroValueUlps, ethValueUlps },
    isIcbm,
    equityTokens,
    etherPriceEur,
  } = yield all({
    values: call(computeCurrencies, convertToUlps(investmentValue), investmentCurrency),
    isIcbm: call(isIcbmInvestment, investmentType),
    equityTokens: select(selectEquityTokenCountByEtoId, eto.etoId),
    etherPriceEur: select(selectEtherPriceEur),
  });

  if (!eto.investmentCalculatedValues) {
    logger.error("ETO investment calculated values are empty");
    throw new Error("ETO investment calculated values are empty");
  }

  yield put(actions.txUserFlowInvestment.submitTransaction({
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
  }))
}

function* reinitInvestmentView(): Iterator<any> {
  const {
    eto,
    wallets,
    investmentType,
    investmentCurrency,
    minTicketEur,
    hasPreviouslyInvested,
    minEthTicketFormatted
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  return {
    formState: EInvestmentFormState.EMPTY,
    eto,
    wallets,
    investmentValue: "",
    euroValueWithFallback: "0",
    investmentType,
    investmentCurrency,
    totalCostEth: "0",
    totalCostEuro: "0",
    minTicketEur,
    hasPreviouslyInvested,
    minEthTicketFormatted,
  };
}

function* populateInvalidViewData(
  investmentValue: string,
  error: TValidationError
) {
  const formData = yield call(reinitInvestmentView);
  formData.formState = EInvestmentFormState.INVALID;
  formData.investmentValue = investmentValue;
  formData.error = error;
  return formData
}

function* calculateInvestmentCostsData(
  investmentValue: string,
  investmentValueType: EInvestmentValueType,
  {
    euroValueUlps,
    ethValueUlps
  }: TInvestmentULPSValuePair,
  txDetails: IGasValidationData
) {
  const {
    eto,
    wallets,
    investmentType,
    investmentCurrency,
    minTicketEur,
    hasPreviouslyInvested,
    minEthTicketFormatted
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const [
    gasCostEth,
    etherPriceEur,
    equityTokenCount,
    etoTicketSizes,
    neuReward,
    etoTokenGeneralDiscounts,
    etoTokenPersonalDiscount,
    etoTokenStandardPrice,
  ] = yield all([
    call(multiplyBigNumbers, [txDetails.gas, txDetails.gasPrice]),
    select(selectEtherPriceEur),
    select(selectEquityTokenCountByEtoId, eto.etoId),
    call(getCalculatedContribution, {eto, investmentValue:"0", investmentType}),
    select(selectNeuRewardUlpsByEtoId, eto.etoId),
    select(selectEtoTokenGeneralDiscounts, eto.etoId),
    select(selectPersonalDiscount, eto.etoId),
    select(selectEtoTokenStandardPrice, eto.previewCode),
  ]);


  const maxTicketEur =
    (etoTicketSizes &&
      etoTicketSizes.maxTicketEurUlps &&
      formatMinMaxTickets(etoTicketSizes.maxTicketEurUlps, ERoundingMode.DOWN)) ||
    "0";

  const [
    equityTokenCountFormatted,
    euroValueWithFallback,
    gasCostEuro,
  ] = yield all([
    call(formatThousands,equityTokenCount.toString()),
    call(formatNumber, {
      value: euroValueUlps,
      inputFormat: ENumberInputFormat.ULPS,
      outputFormat: ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
      decimalPlaces: selectDecimalPlaces(mapInvestmentCurrency(investmentCurrency), ENumberOutputFormat.ONLY_NONZERO_DECIMALS),
      roundingMode: ERoundingMode.UP,
    }),
    call(multiplyBigNumbers,[gasCostEth, etherPriceEur]),
  ]);

  const [
    totalCostEth,
    totalCostEuro
  ] = yield all([
    addBigNumbers([gasCostEth, ethValueUlps || "0"]),
    addBigNumbers([gasCostEuro, euroValueUlps || "0"]),
  ]);

  return {
    formState: EInvestmentFormState.VALID,
    investmentValue,
    investmentValueType,
    eto,
    wallets,
    investmentType,
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
  }
}

export function* getInvestmentInitViewData(
  _: TGlobalDependencies,
) {
  const etoId = yield select(selectTxUserFlowInvestmentEtoId);
  const eto: TEtoWithCompanyAndContractReadonly = nonNullable(
    yield select(selectEtoWithCompanyAndContractById, etoId),
  );

  yield call(preloadInvestmentData, eto);

  const wallets: WalletSelectionData[] = yield call(generateWalletsData);
  const investmentType = yield call(getInvestmentType, wallets);
  const investmentCurrency = yield call(getInvestmentCurrency, investmentType);

  const initialDefaultValues = {
    eto,
    wallets,
    investmentValue: "",
    euroValueWithFallback: "0",
    investmentType,
    investmentCurrency,
    totalCostEth: "0",
    totalCostEuro: "0",
    investmentValueType: EInvestmentValueType.PARTIAL_BALANCE
  };

  const [
    eurPriceEther,
    etoTicketSizes,
    hasPreviouslyInvested,
  ] = yield all([
    select(selectEurPriceEther),
    call(getCalculatedContribution, {eto, investmentValue:"0", investmentType}),
    select(selectHasInvestorTicket, eto.etoId),
  ]);

  const minTicketEur =
    (etoTicketSizes &&
      etoTicketSizes.minTicketEurUlps &&
      formatMinMaxTickets(etoTicketSizes.minTicketEurUlps, ERoundingMode.UP)) ||
    "0";

  const minTicketEth = multiplyBigNumbers([minTicketEur, eurPriceEther]);
  const minEthTicketFormatted = formatNumber({
    value: minTicketEth,
    inputFormat: ENumberInputFormat.FLOAT,
    outputFormat: ENumberOutputFormat.FULL,
    decimalPlaces: selectDecimalPlaces(ECurrency.ETH, ENumberOutputFormat.FULL),
    roundingMode: ERoundingMode.UP,
  });

  const initialComputedValues = {
    minTicketEur,
    hasPreviouslyInvested,
    minEthTicketFormatted,
  };

  return {
    formState: EInvestmentFormState.EMPTY,
    ...initialDefaultValues,
    ...initialComputedValues,
  };
}

function* generateWalletsData(): Iterator<any> {
  const etoId = yield select(selectInvestmentEtoId);

  const [
    etoOnChainState,
    neurStatus,
    userIsWhitelisted,
    balanceNEur,
    ethBalance,
    icbmBalanceNEuro,
    icbmBalanceEth,
    lockedBalanceNEuro,
    lockedBalanceEth,
    ethBalanceAsEuro,
    icbmBalanceEthAsEuro,
  ] = yield all([
    select(selectEtoOnChainStateById, etoId),
    select(selectNEURStatus),
    select(selectIsWhitelisted, etoId),

    select(selectLiquidEuroTokenBalance),
    select(selectLiquidEtherBalance),

    select(selectICBMLockedEuroTokenBalance),
    select(selectICBMLockedEtherBalance),
    select(selectLockedEuroTokenBalance),
    select(selectLockedEtherBalance),

    select(selectLiquidEtherBalanceEuroAmount),
    select(selectICBMLockedEtherBalanceEuroAmount),
  ]);


  let activeInvestmentTypes: EInvestmentType[] = [];

  //todo rewrite this logic in a nicer way
  if (hasFunds(ethBalance)) {
    activeInvestmentTypes.unshift(EInvestmentType.Eth);
  }

  // if neur is not restricted because of the us state
  if (hasFunds(balanceNEur) && neurStatus !== ENEURWalletStatus.DISABLED_RESTRICTED_US_STATE) {
    activeInvestmentTypes.unshift(EInvestmentType.NEur);
  }

  // no regular investment if not whitelisted in pre eto
  if (etoOnChainState === EETOStateOnChain.Whitelist && !userIsWhitelisted) {
    activeInvestmentTypes = [];
  }

  // only ICBM investment if balance available
  if (hasFunds(lockedBalanceNEuro)) {
    activeInvestmentTypes.unshift(EInvestmentType.ICBMnEuro);
  }
  if (hasFunds(lockedBalanceEth)) {
    activeInvestmentTypes.unshift(EInvestmentType.ICBMEth);
  }

  yield put(actions.investmentFlow.setActiveInvestmentTypes(activeInvestmentTypes));

  return createWallets({
    lockedBalanceNEuro,
    balanceNEur,
    icbmBalanceNEuro,
    ethBalance,
    lockedBalanceEth,
    icbmBalanceEth,
    ethBalanceAsEuro,
    icbmBalanceEthAsEuro,
    activeInvestmentTypes
  });
}

function* computeCurrencies(
  valueUlps: string, currency: EInvestmentCurrency
): Iterator<any> {
  console.log("computeCurrencies", valueUlps, currency)
  const etherPriceEur = yield select(selectEtherPriceEur);
  const eurPriceEther = yield select(selectEurPriceEther);

  console.log("computeCurrencies 1", etherPriceEur, eurPriceEther)
  if (etherPriceEur && etherPriceEur !== "0") {
    const valueAsBigNumber = new BigNumber(valueUlps);
    switch (currency) {
      case EInvestmentCurrency.ETH:
        const eurVal = valueAsBigNumber.mul(etherPriceEur);
        return {
          ethValueUlps: valueAsBigNumber.toFixed(0, BigNumber.ROUND_UP),
          euroValueUlps: eurVal.toFixed(0, BigNumber.ROUND_UP),
        };
      case EInvestmentCurrency.EUR_TOKEN:
        const ethVal = valueAsBigNumber.mul(eurPriceEther);
        return {
          ethValueUlps: ethVal.toFixed(0, BigNumber.ROUND_UP),
          euroValueUlps: valueAsBigNumber.toFixed(0, BigNumber.ROUND_UP)
        }
    }
  }
}

type TGetCalculatedContributionInput = {
  eto: TEtoWithCompanyAndContractReadonly,
  investmentValue: string,
  investmentType: EInvestmentType
}

function* getCalculatedContribution({
  eto,
  investmentValue,
  investmentType
}:TGetCalculatedContributionInput):Iterator<any> {
  const isICBM = yield call(isIcbmInvestment, investmentType);
  const contribution = yield neuCall(loadComputedContributionFromContract, eto, investmentValue, isICBM);
  const investorTicket = yield select(selectInvestorTicket, eto.etoId);

  return yield call(calculateTicketLimitsUlps, {contribution,eto,investorTicket})
}

function* validateInvestmentLimits({
  euroValueUlps,
  ethValueUlps
}: TInvestmentULPSValuePair): Iterator<any> {
  const {
    etoId,
    investmentType,
    eto
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const isICBM = yield call(isIcbmInvestment, investmentType);
  const contribution = yield neuCall(loadComputedContributionFromContract, eto, euroValueUlps, isICBM);
  yield put(actions.investorEtoTicket.setCalculatedContribution(etoId, contribution));

  // const contribution = yield select(selectCalculatedContribution,etoId);

  const [wallet, ticketSizes] = yield all([
    select(selectWalletData),
    call(getCalculatedContribution, { eto, investmentValue: euroValueUlps, investmentType })
  ]);

  if (!contribution || !euroValueUlps || !wallet || !ticketSizes) return;

  if (investmentType === EInvestmentType.Eth) {
    const [gasPrice, etherBalance] = yield all([select(selectTxGasCostEthUlps), select(selectLiquidEtherBalance)]);
    if (
      compareBigNumbers(addBigNumbers([ethValueUlps, gasPrice]), etherBalance) > 0
    ) {
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

function* generateInvestmentTransactionWithPresetGas(): any {
  const gasPrice = yield select(selectStandardGasPriceWithOverHead);

  return {
    gas: INVESTMENT_GAS_AMOUNT,
    value: "",
    gasPrice,
  }
}

function* investEntireBalance(): any {
  const { investmentType, investmentCurrency, etoId }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const balance = yield call(calculateEntireBalanceValue, investmentType);
  const balanceFromUlps = convertFromUlps(balance).toString();
  yield all([
    put(actions.txUserFlowInvestment.setInvestmentValue(balanceFromUlps)),
    put(actions.txUserFlowInvestment.setFormStateValidating()),
  ]);

  const validationResult = yield call(validateInvestmentValue,
    {
      value: balanceFromUlps,
      investmentCurrency,
      investmentType,
      etoId,
      investmentValueType: EInvestmentValueType.FULL_BALANCE
    });

  yield call(generateUpdatedView, validationResult, EInvestmentValueType.FULL_BALANCE, balanceFromUlps);
}

function* calculateEntireBalanceValue(
  investmentType: EInvestmentType
) {
  switch (investmentType) {
    case EInvestmentType.ICBMEth:
      return yield select(selectLockedEtherBalance);

    case EInvestmentType.ICBMnEuro:
      return yield select(selectLockedEuroTokenBalance);

    case EInvestmentType.NEur:
      return yield select(selectLiquidEuroTokenBalance);

    case EInvestmentType.Eth:
      const [gasCostEth, fullBalance] = yield all([select(selectTxGasCostEthUlps), select(selectLiquidEtherBalance)]);
      return subtractBigNumbers([fullBalance, gasCostEth]);
  }
}

export function* validateTxGas(
  gasData: IGasValidationData
): Iterator<any> {
  //this is just a wrapper for validateGas that uses exceptions to express validation results.
  //validateGas expects a ITxData but only uses some fields of it. We can't create a real ITxData at this moment.
  //We use IGasValidationData here to make this more clear and only cast to ITxData when calling validateGas
  try {
    yield neuCall(validateGas, gasData as ITxData);

    return EValidationState.VALIDATION_OK;
  } catch (error) {
    if (error instanceof NotEnoughEtherForGasError) {
      return EValidationState.NOT_ENOUGH_ETHER_FOR_GAS;
    } else {
      throw error
    }
  }
}

function* preloadInvestmentData(
  eto: TEtoWithCompanyAndContractReadonly
): Iterator<any> {
  yield all([
    put(actions.investorEtoTicket.loadTokenPersonalDiscount(eto)),
    put(actions.eto.loadTokenTerms(eto)),

    take(actions.eto.setTokenGeneralDiscounts),
    take(actions.investorEtoTicket.setTokenPersonalDiscount),
  ]);
}


export const txUserFlowInvestmentSagas = function* (): Iterator<any> {
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.startInvestment, initInvestmentView);
  yield takeLatest("TOKEN_PRICE_SAVE", recalculateView);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.updateValue, updateInvestmentView);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.investEntireBalance, investEntireBalance);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.submitInvestment, submitInvestment);
  yield fork(neuTakeLatest, actions.txSender.txSenderHideModal, cleanupInvestmentView);
};
