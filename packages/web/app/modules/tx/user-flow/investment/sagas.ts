import BigNumber from "bignumber.js";
import { all, call, fork, put, select, take, takeLatest } from "redux-saga/effects";

import { WalletSelectionData } from "../../../../components/modals/tx-sender/investment-flow/InvestmentTypeSelector";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  formatNumber,
  formatThousands,
  isEmptyValue,
  parseInputToNumber,
  selectDecimalPlaces,
} from "../../../../components/shared/formatters/utils";
import { EInvestmentErrorMessage } from "../../../../components/translatedMessages/messages";
import { createMessage, TMessage } from "../../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { TEtoSpecsData } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IGasValidationData, ITxData } from "../../../../lib/web3/types";
import { NotEnoughEtherForGasError } from "../../../../lib/web3/Web3Adapter";
import {
  addBigNumbers,
  compareBigNumbers,
  multiplyBigNumbers,
  subtractBigNumbers,
} from "../../../../utils/BigNumberUtils";
import { EProcessState } from "../../../../utils/enums/processStates";
import { InvariantError } from "../../../../utils/invariant";
import { nonNullable } from "../../../../utils/nonNullable";
import { convertFromUlps, convertToUlps } from "../../../../utils/NumberUtils";
import { actions, TActionFromCreator } from "../../../actions";
import {
  selectEtoOnChainStateById,
  selectEtoTokenGeneralDiscounts,
  selectEtoTokenStandardPrice,
  selectEtoWithCompanyAndContractById,
} from "../../../eto/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContractReadonly } from "../../../eto/types";
import { loadComputedContributionFromContract } from "../../../investor-portfolio/sagas";
import {
  selectEquityTokenCountByEtoId,
  selectHasIdInvestorTicket,
  selectInvestorTicket,
  selectIsWhitelisted,
  selectNeuRewardUlpsByEtoId,
  selectPersonalDiscount,
} from "../../../investor-portfolio/selectors";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import { selectEtherPriceEur, selectEurPriceEther } from "../../../shared/tokenPrice/selectors";
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
} from "../../../wallet/selectors";
import { ENEURWalletStatus } from "../../../wallet/types";
import { selectTxGasCostEthUlps } from "../../sender/selectors";
import { generateInvestmentTransaction } from "../../transactions/investment/sagas";
import { isEthInvestment } from "../../transactions/investment/selectors";
import { EValidationState } from "../../validator/reducer";
import { validateGas } from "../../validator/sagas";
import {
  EInputValidationError,
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentFormState,
  EInvestmentType,
  EInvestmentValueType,
  TTxUserFlowInvestmentBasicData,
  TTxUserFlowInvestmentCalculatedCostsData,
  TTxUserFlowInvestmentReadyState,
  TValidationError,
} from "./reducer";
import { selectTxUserFlowInvestmentEtoId, selectTxUserFlowInvestmentState } from "./selectors";
import {
  calculateTicketLimitsUlps,
  createWallets,
  formatMinMaxTickets,
  getInvestmentCurrency,
  getInvestmentType,
  hasFunds,
  isIcbmInvestment,
} from "./utils";

export type TInvestmentValidationResult = {
  validationError: TValidationError | null;
  investmentDetails: {
    investmentTransaction: ITxData;
    euroValueUlps: string;
    ethValueUlps: string;
  };
};

export type TInvestmentULPSValuePair = {
  euroValueUlps: string;
  ethValueUlps: string;
};

export type TValidateInvestmentValueInput = {
  value: string;
  investmentCurrency: EInvestmentCurrency;
  investmentType: EInvestmentType;
  etoId: string;
  investmentValueType: EInvestmentValueType;
};

type TGetCalculatedContributionInput = {
  eto: TEtoWithCompanyAndContractReadonly;
  euroValueUlps: string;
  investmentType: EInvestmentType;
};

function* initInvestmentView(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txUserFlowInvestment.startInvestment>,
): Generator<any, any, any> {
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
}

function* updateInvestmentView(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txUserFlowInvestment.updateValue>,
): Generator<any, any, any> {
  const {
    investmentCurrency,
    investmentValue: oldValue,
    investmentType,
    etoId,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  if (payload.value === oldValue) {
    return;
  } else {
    // many api calls ahead, set investment value to show it in the UI in the meantime
    yield put(actions.txUserFlowInvestment.setInvestmentValue(payload.value));
    yield put(actions.txUserFlowInvestment.setFormStateValidating());

    const validationResult = yield call(validateInvestmentValue, {
      value: payload.value,
      investmentCurrency,
      investmentType,
      etoId,
      investmentValueType: EInvestmentValueType.PARTIAL_BALANCE,
    });
    const investmentCalculatedData = yield call(
      generateUpdatedView,
      validationResult,
      EInvestmentValueType.PARTIAL_BALANCE,
      payload.value,
    );
    yield put(actions.txUserFlowInvestment.setViewData(investmentCalculatedData));
  }
}

function* changeInvestmentType(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txUserFlowInvestment.setInvestmentType>,
): Generator<any, any, any> {
  yield put(actions.txUserFlowInvestment.setInvestmentType(payload.investmentType));

  const viewData = yield call(reinitInvestmentView);
  yield put(actions.txUserFlowInvestment.setViewData(viewData));
}

function* recalculateView(): Generator<any, any, any> {
  const {
    formState,
    investmentValue,
    investmentCurrency,
    investmentType,
    etoId,
    investmentValueType,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  //recalculate only if there's user has entered any data in the form.
  if (formState === EInvestmentFormState.INVALID || formState === EInvestmentFormState.VALID) {
    yield put(actions.txUserFlowInvestment.setFormStateValidating());

    const validationResult = yield call(validateInvestmentValue, {
      value: investmentValue,
      investmentCurrency,
      investmentType,
      etoId,
      investmentValueType,
    });

    const viewData = yield call(
      generateUpdatedView,
      validationResult,
      investmentValueType,
      investmentValue,
    );
    yield put(actions.txUserFlowInvestment.setViewData(viewData));
  }
}

export function* cleanupInvestmentView(): Generator<any, any, any> {
  yield put(actions.txUserFlowInvestment.reset());
}

function* validateInvestmentValue({
  value,
  investmentCurrency,
  investmentType,
  etoId,
  investmentValueType,
}: TValidateInvestmentValueInput): Generator<any, any, any> {
  const isEmpty = yield isEmptyValue(value);
  if (isEmpty) {
    return { validationError: EInputValidationError.IS_EMPTY, txDetails: null };
  }

  const isAValidNumber = yield parseInputToNumber(value);
  if (!isAValidNumber) {
    return { validationError: EInputValidationError.NOT_A_NUMBER, txDetails: null };
  }

  const investmentValueUlps = yield call(convertToUlps, value);
  const { euroValueUlps, ethValueUlps } = yield call(
    computeCurrencies,
    investmentValueUlps,
    investmentCurrency,
  );
  const validationError: EInvestmentErrorState | undefined = yield call(validateInvestmentLimits, {
    euroValueUlps,
    ethValueUlps,
  });
  if (validationError) {
    return { validationError: validationError, txDetails: null };
  }

  const investmentTransaction = yield neuCall(generateInvestmentTransaction, {
    investmentValueType,
    investmentType,
    etoId,
    investAmountUlps: new BigNumber(isEthInvestment(investmentType) ? ethValueUlps : euroValueUlps),
  });

  const txValidationResult = yield call(validateTxGas, investmentTransaction);
  if (txValidationResult !== EValidationState.VALIDATION_OK) {
    return { validationError: txValidationResult, txDetails: null };
  } else {
    return {
      validationError: null,
      investmentDetails: { investmentTransaction, euroValueUlps, ethValueUlps },
    };
  }
}

function* generateUpdatedView(
  validationResult: TInvestmentValidationResult,
  investmentValueType: EInvestmentValueType,
  value: string,
): Generator<any, any, any> {
  const { validationError, investmentDetails } = validationResult;
  if (validationError !== null) {
    switch (validationError) {
      case EInputValidationError.IS_EMPTY: {
        return yield call(reinitInvestmentView);
      }
      case EInputValidationError.NOT_A_NUMBER:
      case EInvestmentErrorState.AboveMaximumTicketSize:
      case EInvestmentErrorState.BelowMinimumTicketSize:
      case EInvestmentErrorState.ExceedsTokenAmount:
      case EInvestmentErrorState.ExceedsWalletBalance:
      case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS: {
        return yield call(populateInvalidViewData, value, validationError);
      }
    }
  } else {
    const { investmentTransaction, euroValueUlps, ethValueUlps } = investmentDetails;
    return yield call(
      calculateInvestmentCostsData,
      value,
      investmentValueType,
      {
        euroValueUlps,
        ethValueUlps,
      },
      investmentTransaction,
    );
  }
}

function* submitInvestment({ logger }: TGlobalDependencies): Generator<any, any, any> {
  const {
    investmentValueType,
    investmentCurrency,
    investmentType,
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
    isIcbm: call(isIcbmInvestment, investmentType),
    equityTokens: select(selectEquityTokenCountByEtoId, eto.etoId),
    etherPriceEur: select(selectEtherPriceEur),
  });

  if (!eto.investmentCalculatedValues) {
    logger.error("ETO investment calculated values are empty");
    throw new Error("ETO investment calculated values are empty");
  }

  const transactionData = yield neuCall(generateInvestmentTransaction, {
    investmentValueType,
    investmentType,
    etoId: eto.etoId,
    investAmountUlps: new BigNumber(isEthInvestment(investmentType) ? ethValueUlps : euroValueUlps),
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

function* reinitInvestmentView(): Generator<any, any, any> {
  const {
    eto,
    wallets,
    investmentType,
    minTicketEur,
    hasPreviouslyInvested,
    etoTokenGeneralDiscounts,
    etoTokenPersonalDiscount,
    etoTokenStandardPrice,
    minEthTicketFormatted,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const investmentCurrency = yield call(getInvestmentCurrency, investmentType);

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
    etoTokenGeneralDiscounts,
    etoTokenPersonalDiscount,
    etoTokenStandardPrice,
  };
}

function* populateInvalidViewData(
  investmentValue: string,
  error: TValidationError,
): Generator<any, any, any> {
  const {
    eto,
    investmentType,
    investmentCurrency,
    minTicketEur,
    minTicketEth,
    ...formData
  } = yield call(reinitInvestmentView);

  let errorMessage: TMessage;

  switch (error) {
    case EInputValidationError.NOT_A_NUMBER:
      errorMessage = createMessage(EInvestmentErrorMessage.NOT_A_NUMBER);
      break;
    case EInvestmentErrorState.AboveMaximumTicketSize:
      const { euroValueUlps } = yield call(
        computeCurrencies,
        convertToUlps(investmentValue),
        investmentCurrency,
      );
      const { maxTicketEur } = yield getEuroTicketSizes({ eto, euroValueUlps, investmentType });
      errorMessage = createMessage(EInvestmentErrorMessage.ABOVE_MAXIMUM_TICKET_SIZE, {
        value: maxTicketEur,
      });
      break;
    case EInvestmentErrorState.BelowMinimumTicketSize:
      errorMessage = createMessage(EInvestmentErrorMessage.BELOW_MINIMUM_TICKET_SIZE, {
        investmentCurrency: investmentCurrency,
        minTicketEur: minTicketEur,
        minTicketEth: minTicketEth,
      });
      break;
    case EInvestmentErrorState.ExceedsTokenAmount:
      errorMessage = createMessage(EInvestmentErrorMessage.EXCEEDS_TOKEN_AMOUNT, {
        tokenName: formData.eto.equityTokenName,
      });
      break;
    case EInvestmentErrorState.ExceedsWalletBalance:
      errorMessage = createMessage(EInvestmentErrorMessage.EXCEEDS_WALLET_BALANCE);
      break;
    case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS:
      errorMessage = createMessage(EInvestmentErrorMessage.NOT_ENOUGH_ETHER_FOR_GAS);
      break;
    default:
      throw new InvariantError("mapErrorsToMessages received an unexpected message variant");
  }

  return {
    ...formData,
    formState: EInvestmentFormState.INVALID,
    error: errorMessage,
    eto,
    investmentType,
    investmentCurrency,
    minTicketEur,
    minTicketEth,
  };
}

type TGetmaxTicketEurInput = {
  eto: TEtoWithCompanyAndContractReadonly;
  euroValueUlps: string;
  investmentType: EInvestmentType;
};

function* getEuroTicketSizes({
  eto,
  euroValueUlps,
  investmentType,
}: TGetmaxTicketEurInput): Generator<any, any, any> {
  const etoTicketSizes = yield call(getCalculatedContribution, {
    eto,
    euroValueUlps,
    investmentType,
  });

  const minTicketEur =
    (etoTicketSizes.minTicketEurUlps &&
      formatMinMaxTickets(etoTicketSizes.minTicketEurUlps, ERoundingMode.UP)) ||
    "0";

  const maxTicketEur =
    (etoTicketSizes.maxTicketEurUlps &&
      formatMinMaxTickets(etoTicketSizes.maxTicketEurUlps, ERoundingMode.DOWN)) ||
    "0";

  return {
    minTicketEur,
    maxTicketEur,
  };
}

function* calculateInvestmentCostsData(
  investmentValue: string,
  investmentValueType: EInvestmentValueType,
  { euroValueUlps, ethValueUlps }: TInvestmentULPSValuePair,
  txDetails: IGasValidationData,
): Generator<any, any, any> {
  const {
    eto,
    wallets,
    investmentType,
    investmentCurrency,
    minTicketEur,
    hasPreviouslyInvested,
    minEthTicketFormatted,
    etoTokenGeneralDiscounts,
    etoTokenPersonalDiscount,
    etoTokenStandardPrice,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const [gasCostEth, etherPriceEur, equityTokenCount, { maxTicketEur }, neuReward] = yield all([
    call(multiplyBigNumbers, [txDetails.gas, txDetails.gasPrice]),
    select(selectEtherPriceEur),
    select(selectEquityTokenCountByEtoId, eto.etoId),
    call(getEuroTicketSizes, { eto, euroValueUlps: "0", investmentType }),
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
  };
}

export function* getInvestmentInitViewData(_: TGlobalDependencies): Generator<any, any, any> {
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
    investmentValueType: EInvestmentValueType.PARTIAL_BALANCE,
  };

  const [
    eurPriceEther,
    hasPreviouslyInvested,
    etoTokenGeneralDiscounts,
    etoTokenPersonalDiscount,
    etoTokenStandardPrice,
  ] = yield all([
    select(selectEurPriceEther),
    select(selectHasInvestorTicket, eto.etoId),
    select(selectEtoTokenGeneralDiscounts, eto.etoId),
    select(selectPersonalDiscount, eto.etoId),
    select(selectEtoTokenStandardPrice, eto.previewCode),
  ]);

  const { minTicketEur } = yield getEuroTicketSizes({ eto, euroValueUlps: "0", investmentType });

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
    minTicketEth,
    hasPreviouslyInvested,
    minEthTicketFormatted,
    etoTokenGeneralDiscounts,
    etoTokenPersonalDiscount,
    etoTokenStandardPrice,
  };

  return {
    formState: EInvestmentFormState.EMPTY,
    ...initialDefaultValues,
    ...initialComputedValues,
  };
}

function* generateWalletsData(): Generator<any, any, any> {
  const etoId = yield select(selectTxUserFlowInvestmentEtoId);

  const {
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
  } = yield all({
    etoOnChainState: select(selectEtoOnChainStateById, etoId),
    neurStatus: select(selectNEURStatus),
    userIsWhitelisted: select(selectIsWhitelisted, etoId),
    balanceNEur: select(selectLiquidEuroTokenBalance),
    ethBalance: select(selectLiquidEtherBalance),
    icbmBalanceNEuro: select(selectICBMLockedEuroTokenBalance),
    icbmBalanceEth: select(selectICBMLockedEtherBalance),
    lockedBalanceNEuro: select(selectLockedEuroTokenBalance),
    lockedBalanceEth: select(selectLockedEtherBalance),
    ethBalanceAsEuro: select(selectLiquidEtherBalanceEuroAmount),
    icbmBalanceEthAsEuro: select(selectICBMLockedEtherBalanceEuroAmount),
  });

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

  return createWallets({
    lockedBalanceNEuro,
    balanceNEur,
    icbmBalanceNEuro,
    ethBalance,
    lockedBalanceEth,
    icbmBalanceEth,
    ethBalanceAsEuro,
    icbmBalanceEthAsEuro,
    activeInvestmentTypes,
  });
}

function* computeCurrencies(
  valueUlps: string,
  currency: EInvestmentCurrency,
): Generator<any, any, any> {
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
          euroValueUlps: valueAsBigNumber.toFixed(0, BigNumber.ROUND_UP),
        };
    }
  }
}

function* getCalculatedContribution({
  eto,
  euroValueUlps,
  investmentType,
}: TGetCalculatedContributionInput): Generator<any, any, any> {
  const isICBM = yield call(isIcbmInvestment, investmentType);
  const contribution = yield neuCall(
    loadComputedContributionFromContract,
    eto as TEtoSpecsData,
    euroValueUlps,
    isICBM,
  );
  const investorTicket = yield select(selectInvestorTicket, eto.etoId);

  return yield call(calculateTicketLimitsUlps, {
    contribution,
    eto: eto as TEtoSpecsData,
    investorTicket,
  });
}

function* validateInvestmentLimits({
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

function* investEntireBalance(): Generator<any, any, any> {
  const {
    investmentType,
    investmentCurrency,
    etoId,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const balance = yield call(calculateEntireBalanceValue, investmentType);
  const balanceFromUlps = convertFromUlps(balance).toString();

  yield all([
    put(actions.txUserFlowInvestment.setInvestmentValue(balanceFromUlps)),
    put(actions.txUserFlowInvestment.setFormStateValidating()),
  ]);

  const validationResult = yield call(validateInvestmentValue, {
    value: balanceFromUlps,
    investmentCurrency,
    investmentType,
    etoId,
    investmentValueType: EInvestmentValueType.FULL_BALANCE,
  });

  const viewData = yield call(
    generateUpdatedView,
    validationResult,
    EInvestmentValueType.FULL_BALANCE,
    balanceFromUlps,
  );
  yield put(actions.txUserFlowInvestment.setViewData(viewData));
}

function* calculateEntireBalanceValue(investmentType: EInvestmentType): Generator<any, any, any> {
  switch (investmentType) {
    case EInvestmentType.ICBMEth:
      return yield select(selectLockedEtherBalance);

    case EInvestmentType.ICBMnEuro:
      return yield select(selectLockedEuroTokenBalance);

    case EInvestmentType.NEur:
      return yield select(selectLiquidEuroTokenBalance);

    case EInvestmentType.Eth:
      const [gasCostEth, fullBalance] = yield all([
        select(selectTxGasCostEthUlps),
        select(selectLiquidEtherBalance),
      ]);
      return subtractBigNumbers([fullBalance, gasCostEth]);
  }
}

export function* validateTxGas(investmentTransaction: ITxData): Generator<any, any, any> {
  //this is just a wrapper for validateGas that uses exceptions to express validation results.
  try {
    yield neuCall(validateGas, investmentTransaction);

    return EValidationState.VALIDATION_OK;
  } catch (error) {
    if (error instanceof NotEnoughEtherForGasError) {
      return EValidationState.NOT_ENOUGH_ETHER_FOR_GAS;
    } else {
      throw error;
    }
  }
}

function* preloadInvestmentData(eto: TEtoWithCompanyAndContractReadonly): Generator<any, any, any> {
  yield all([
    put(actions.investorEtoTicket.loadTokenPersonalDiscount(eto)),
    put(actions.eto.loadTokenTerms(eto)),

    take(actions.eto.setTokenGeneralDiscounts),
    take(actions.investorEtoTicket.setTokenPersonalDiscount),
  ]);
}

export const txUserFlowInvestmentSagas = function*(): Generator<any, any, any> {
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.startInvestment, initInvestmentView);
  yield takeLatest("TOKEN_PRICE_SAVE", recalculateView);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.updateValue, updateInvestmentView);
  yield fork(
    neuTakeLatest,
    actions.txUserFlowInvestment.changeInvestmentType,
    changeInvestmentType,
  );
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.investEntireBalance, investEntireBalance);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.submitInvestment, submitInvestment);
  yield fork(neuTakeLatest, actions.txSender.txSenderHideModal, cleanupInvestmentView);
};
