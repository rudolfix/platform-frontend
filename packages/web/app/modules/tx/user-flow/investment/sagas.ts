import { all, call, fork, put, select, take } from "redux-saga/effects";

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
  selectCalculatedEtoTicketSizesUlpsById,
  selectEquityTokenCountByEtoId,
  selectHasInvestorTicket,
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
  EInvestmentFormState,
  TTxUserFlowInvestmentBasicData,
  TTxUserFlowInvestmentCalculatedCostsData,
  TTxUserFlowInvestmentReadyState,
} from "./reducer";
import BigNumber from "bignumber.js";
import { loadComputedContributionFromContract } from "../../../investor-portfolio/sagas";
import { validateGas } from "../../validator/sagas";
import { convertFromUlps, convertToUlps } from "../../../../utils/NumberUtils";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { generateInvestmentTransaction, INVESTMENT_GAS_AMOUNT } from "../../transactions/investment/sagas";
import { isEthInvestment } from "../../transactions/investment/selectors";
import { IGasValidationData } from "../../../../lib/web3/types";
import { NotEnoughEtherForGasError } from "../../../../lib/web3/Web3Adapter";
import { createWallets, formatMinMaxTickets, getInvestmentCurrency, hasFunds, isIcbmInvestment } from "./utils";
import { WalletSelectionData } from "../../../../components/modals/tx-sender/investment-flow/InvestmentTypeSelector";

export enum EInvestmentCurrency {
  ETH = ECurrency.ETH,
  EUR_TOKEN = ECurrency.EUR_TOKEN,
}

enum EInvestmentValueType {
  FULL_BALANCE = "fullBalance",
  PARTIAL_BALANCE = "partialBalance"
}

enum EInputValidationError {
  IS_EMPTY = "isEmpty",
  NOT_A_NUMBER = "notANumber",
}

type TValidationError = EInputValidationError | EInvestmentErrorState | EValidationState.NOT_ENOUGH_ETHER_FOR_GAS

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
  { payload }: TActionFromCreator<typeof actions.investmentFlow.startInvestment>
) {
  //wait until the preparational phase is over. This is for backwards compatibility
  yield take(actions.txSender.txSenderShowModal);
  const { processState } = yield select(selectTxUserFlowInvestmentState);

  if (processState === EProcessState.NOT_STARTED) {
    yield put(actions.txUserFlowInvestment.setEtoId(payload.etoId));
    yield neuCall(getInvestmentInitViewData);
  }
}

function* updateInvestmentView(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txUserFlowInvestment.updateValue>
) {
  const {
    investmentCurrency,
    investmentValue: oldValue,
    investmentType,
    etoId
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  if (payload.value === oldValue) {
    return
  } else {
    yield all([
      put(actions.txUserFlowInvestment.setInvestmentValue(payload.value)),
      put(actions.txUserFlowInvestment.setFormState(EInvestmentFormState.VALIDATING)),
    ]);

    const validationResult = yield call(validateInvestmentValue,
      {
        value: payload.value,
        investmentCurrency,
        investmentType,
        etoId,
        investmentValueType: EInvestmentValueType.PARTIAL_BALANCE
      });

    yield call(generateUpdatedView, validationResult, payload.value)
  }
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
  value: string
) {
  const { validationError, investmentDetails } = validationResult;

  if (validationError !== null) {
    switch (validationError) {
      case EInputValidationError.IS_EMPTY: {
        const formResetData = yield call(reinitInvestmentView);
        return yield put(actions.txUserFlowInvestment.setViewData(formResetData));
      }
      case EInputValidationError.NOT_A_NUMBER: {
        const formInvalidData = yield call(populateInvalidViewData, value, EInputValidationError.NOT_A_NUMBER);
        return yield put(actions.txUserFlowInvestment.setViewData(formInvalidData));
      }
      case EInvestmentErrorState.AboveMaximumTicketSize:
      case EInvestmentErrorState.BelowMinimumTicketSize:
      case EInvestmentErrorState.ExceedsTokenAmount:
      case EInvestmentErrorState.ExceedsWalletBalance:
      case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS: {
        const formInvalidData = yield call(populateInvalidViewData, value, validationError);
        return yield put(actions.txUserFlowInvestment.setViewData(formInvalidData));
      }
    }
  } else {
    const { investmentGasData, euroValueUlps, ethValueUlps } = investmentDetails;
    const investmentCalculatedData = yield call(calculateInvestmentCostsData, value, {
      euroValueUlps,
      ethValueUlps
    }, investmentGasData);
    return yield put(actions.txUserFlowInvestment.setViewData(investmentCalculatedData));
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
    select(selectCalculatedEtoTicketSizesUlpsById, eto.etoId),
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
    formatThousands(equityTokenCount.toString()),
    euroValueUlps,
    multiplyBigNumbers([gasCostEth, etherPriceEur]),
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

function* cleanupInvestmentView() {
  yield put(actions.txUserFlowInvestment.reset())
}

export function* getInvestmentInitViewData(
  _: TGlobalDependencies,
) {
  const etoId = yield select(selectTxUserFlowInvestmentEtoId);
  const eto: TEtoWithCompanyAndContractReadonly = nonNullable(
    yield select(selectEtoWithCompanyAndContractById, etoId),
  );

  const wallets: WalletSelectionData[] = yield call(generateWalletsData);
  let investmentType;

  if (!wallets.find((wallet: WalletSelectionData) => wallet.type === EInvestmentType.Eth)) {
    investmentType = wallets[0].type
  } else {
    investmentType = EInvestmentType.Eth
  }

  const initialValues = {
    eto,
    wallets,
    investmentValue: "",
    euroValueWithFallback: "0",
    investmentType,
    investmentCurrency: getInvestmentCurrency(investmentType),
    totalCostEth: "0",
    totalCostEuro: "0",
  };

  const [
    eurPriceEther,
    etoTicketSizes,
    hasPreviouslyInvested,
  ] = yield all([
    select(selectEurPriceEther),
    select(selectCalculatedEtoTicketSizesUlpsById, eto.etoId),
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

  const initalComputedValues = {
    minTicketEur,
    hasPreviouslyInvested,
    minEthTicketFormatted,
  };

  yield put(actions.txUserFlowInvestment.setViewData({
    formState: EInvestmentFormState.EMPTY,
    ...initialValues,
    ...initalComputedValues,
  }));
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
  const etherPriceEur = yield select(selectEtherPriceEur);
  const eurPriceEther = yield select(selectEurPriceEther);

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

  const [wallet, ticketSizes] = yield all([
    select(selectWalletData),
    select(selectCalculatedEtoTicketSizesUlpsById, etoId)
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
    put(actions.txUserFlowInvestment.setFormState(EInvestmentFormState.VALIDATING)),
  ]);

  const validationResult = yield call(validateInvestmentValue,
    {
      value: balanceFromUlps,
      investmentCurrency,
      investmentType,
      etoId,
      investmentValueType: EInvestmentValueType.FULL_BALANCE
    });

  yield call(generateUpdatedView, validationResult, balanceFromUlps);
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
  //this is just a wrapper for validateGas that uses exceptions
  try {
    yield neuCall(validateGas, gasData);

    return EValidationState.VALIDATION_OK;
  } catch (error) {
    if (error instanceof NotEnoughEtherForGasError) {
      return EValidationState.NOT_ENOUGH_ETHER_FOR_GAS;
    } else {
      throw error
    }
  }
}

export const txUserFlowInvestmentSagas = function* (): Iterator<any> {
  yield fork(neuTakeLatest, actions.investmentFlow.startInvestment, initInvestmentView);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.updateValue, updateInvestmentView);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.investEntireBalance, investEntireBalance);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.submitInvestment, submitInvestment);
  yield fork(neuTakeLatest, actions.txSender.txSenderHideModal, cleanupInvestmentView);
};
