import { all, call, fork, put, select, take } from "redux-saga/effects";

import { actions, TActionFromCreator } from "../../../actions";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { selectTxUserFlowInvestmentEtoId, selectTxUserFlowInvestmentState } from "./selectors";
import { EProcessState } from "../../../../utils/enums/processStates";
import { EETOStateOnChain, TEtoWithCompanyAndContractReadonly } from "../../../eto/types";
import { selectInvestmentEtoId, selectInvestmentType, } from "../../../investment-flow/selectors";
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
  createWallets,
  EInvestmentCurrency,
  formatMinMaxTickets,
  getInvestmentCurrency
} from "../../../../components/modals/tx-sender/investment-flow/utils";
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
  EInvestmentInputValidationError,
  TTxUserFlowInvestmentBasicData, TTxUserFlowInvestmentCalculatedCostsData,
  TTxUserFlowInvestmentReadyState,
} from "./reducer";
import BigNumber from "bignumber.js";
import { loadComputedContributionFromContract } from "../../../investor-portfolio/sagas";
import { txValidateInvestmentInternal } from "../../validator/sagas";
import { convertFromUlps, convertToUlps } from "../../../../utils/NumberUtils";
import { IAppState } from "../../../../store";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { INVESTMENT_GAS_AMOUNT } from "../../transactions/investment/sagas";
import { isEtherInvestment } from "../../transactions/investment/selectors";
import { ETxSenderType, TAdditionalDataByType } from "../../types";


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
  const { investmentCurrency, investmentValue }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const valueIsAValidNumber = yield parseInputToNumber(payload.value);
  const valueIsEmpty = yield isEmptyValue(payload.value);

  if (payload.value === investmentValue) {
    return
  } else if (valueIsEmpty) {
    const formResetData = yield call(reinitInvestmentView);
    yield put(actions.txUserFlowInvestment.setViewData(formResetData))

  } else if (!valueIsAValidNumber) {
    const formInvalidData = yield call(populateInvalidViewData, payload.value, EInvestmentInputValidationError.INPUT_VALIDATION_ERROR);
    yield put(actions.txUserFlowInvestment.setViewData(formInvalidData));

  } else {
    //calculations and validations take time, set the new value to show it in UI in the meantime
    yield put(actions.txUserFlowInvestment.setInvestmentValue(payload.value));

    const investmentValueUlps = convertToUlps(payload.value);

    const { euroValueUlps, ethValueUlps } = yield call(computeCurrencies, investmentValueUlps, investmentCurrency);
    const validationResult = yield neuCall(validateInvestmentInput, {euroValueUlps,ethValueUlps});

    if (validationResult !== EValidationState.VALIDATION_OK) {
      const formInvalidData = yield call(populateInvalidViewData, payload.value, validationResult);
      yield put(actions.txUserFlowInvestment.setViewData(formInvalidData));
    } else {
      const investmentCalculatedData = yield call(calculateInvestmentCostsData, payload.value, {euroValueUlps, ethValueUlps});
      yield put(actions.txUserFlowInvestment.setViewData(investmentCalculatedData));
    }
  }
}

//fixme add VALIDATING form state to prevent submitting when validation is not ready
function* submitInvestment(
  {logger}:TGlobalDependencies
){
  console.log("submitInvestment")
  const {
    investmentCurrency,
    investmentType,
    investmentValue,
    eto,
    gasCostEth,
    neuReward,
  }: TTxUserFlowInvestmentBasicData & TTxUserFlowInvestmentCalculatedCostsData = yield select(selectTxUserFlowInvestmentState);

  const { euroValueUlps, ethValueUlps } = yield call(computeCurrencies, convertToUlps(investmentValue), investmentCurrency);
  const isIcbm = yield call(isIcbmInvestment, investmentType);
  const equityTokens = yield select(selectEquityTokenCountByEtoId, eto.etoId);
  const etherPriceEur = yield select(selectEtherPriceEur);

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
    investmentEth:ethValueUlps,
    investmentEur:euroValueUlps,
    gasCostEth,
    equityTokens,
    estimatedReward:neuReward,
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
  error: any //fixme
) {
  const formData = yield call(reinitInvestmentView);
  formData.formState = EInvestmentFormState.INVALID;
  formData.investmentValue = investmentValue;
  formData.error = error;
  return formData
}

function* calculateInvestmentCostsData(
  investmentValue: string,
  {euroValueUlps,
  ethValueUlps}:TInvestmentValuePair
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

  const etherPriceEur = yield select(selectEtherPriceEur);
  const equityTokenCount = yield select(selectEquityTokenCountByEtoId, eto.etoId);
  const etoTicketSizes = yield select(selectCalculatedEtoTicketSizesUlpsById, eto.etoId);
  const neuReward = yield select(selectNeuRewardUlpsByEtoId, eto.etoId);
  const etoTokenGeneralDiscounts = yield select(selectEtoTokenGeneralDiscounts, eto.etoId);
  const etoTokenPersonalDiscount = yield select(selectPersonalDiscount, eto.etoId);
  const etoTokenStandardPrice = yield select(selectEtoTokenStandardPrice, eto.previewCode);
  const gasCostEth = yield select(selectTxGasCostEthUlps); //fixme this uses txDetails
  console.log("-----------------gasCostEth",gasCostEth)
  const maxTicketEur =
    (etoTicketSizes &&
      etoTicketSizes.maxTicketEurUlps &&
      formatMinMaxTickets(etoTicketSizes.maxTicketEurUlps, ERoundingMode.DOWN)) ||
    "0";
  const equityTokenCountFormatted = formatThousands(equityTokenCount.toString());
  const euroValueWithFallback = euroValueUlps;
  const gasCostEuro = yield multiplyBigNumbers([gasCostEth, etherPriceEur]);
  const totalCostEth = yield addBigNumbers([gasCostEth, ethValueUlps || "0"]);
  const totalCostEuro = yield addBigNumbers([gasCostEuro, euroValueUlps || "0"]);

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
  try {
    const etoId = yield select(selectTxUserFlowInvestmentEtoId);
    const eto: TEtoWithCompanyAndContractReadonly = nonNullable(
      yield select(selectEtoWithCompanyAndContractById, etoId),
    );

    const investmentType = EInvestmentType.Eth; //fixme sync with walletData

    const initialValues = {
      eto,
      wallets: yield call(generateWalletsData),
      investmentValue: "",
      euroValueWithFallback: "0",
      investmentType,
      investmentCurrency: getInvestmentCurrency(investmentType),
      totalCostEth: "0",
      totalCostEuro: "0", //fixme those shouldn't be in the initial view
    };

    const {
      eurPriceEther,
      etoTicketSizes,
      hasPreviouslyInvested,
    } = yield all({
      eurPriceEther: select(selectEurPriceEther),
      etoTicketSizes: select(selectCalculatedEtoTicketSizesUlpsById, eto.etoId),
      hasPreviouslyInvested: select(selectHasInvestorTicket, eto.etoId),
    });

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
    console.log('getInvestmentViewData stopped')
  } catch (e) {
    console.log(e) //fixme
  }
}

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
  if (currentType && !activeTypes.includes(currentType)) {
    yield put(actions.investmentFlow.selectInvestmentType(activeTypes[0]));
  }

  const wallets = createWallets(lockedBalanceNEuro, balanceNEur, icbmBalanceNEuro,
    ethBalance, lockedBalanceEth, icbmBalanceEth, ethBalanceAsEuro, icbmBalanceEthAsEuro, activeTypes);
  return wallets
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

function* validateInvestmentInput(
  _: TGlobalDependencies,
  {euroValueUlps,
  ethValueUlps}:TInvestmentValuePair,
): Iterator<any> {
  const { etoId, investmentType }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const validationError = yield call(validateInvestment, {euroValueUlps, ethValueUlps});

  if (validationError) {
    yield put(actions.investmentFlow.setErrorState(validationError));
    return validationError
  }
  const txValidationResult = yield call(txValidateInvestmentInternal, {
    investmentType,
    etoId,
    investAmountUlps: isEtherInvestment(investmentType) ? ethValueUlps : euroValueUlps
  });

  if (txValidationResult !== EValidationState.VALIDATION_OK) {
    return txValidationResult
  }

  return EValidationState.VALIDATION_OK
}

export type TInvestmentValuePair = {
  euroValueUlps: string,
    ethValueUlps: string
}

function* validateInvestment({
  euroValueUlps,
  ethValueUlps
}:TInvestmentValuePair): Iterator<any> {
  const {
    etoId,
    investmentType,
    eto
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  const isICBM = yield call(isIcbmInvestment, investmentType);
  const contribution = yield neuCall(loadComputedContributionFromContract, eto, euroValueUlps, isICBM);
  yield put(actions.investorEtoTicket.setCalculatedContribution(etoId, contribution));

  const wallet = yield select(selectWalletData);
  const ticketSizes = yield select(selectCalculatedEtoTicketSizesUlpsById, etoId);

  if (!contribution || !euroValueUlps || !wallet || !ticketSizes) return;

  if (investmentType === EInvestmentType.Eth) {
    const gasPrice = yield select(selectTxGasCostEthUlps);
    const etherBalance = yield select(selectLiquidEtherBalance);
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

function* investEntireBalance(): any {
  const { investmentType }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);
  yield setTransactionWithPresetGas(); //fixme remove this, store gas data elsewhere
  const state: IAppState = yield select();

  let balance = "";
  switch (investmentType) {
    case EInvestmentType.ICBMEth:
      balance = selectLockedEtherBalance(state);
      break;

    case EInvestmentType.ICBMnEuro:
      balance = selectLockedEuroTokenBalance(state);
      break;

    case EInvestmentType.NEur:
      balance = selectLiquidEuroTokenBalance(state);
      break;

    case EInvestmentType.Eth:
      const gasCostEth = selectTxGasCostEthUlps(state);
      const fullBalance = selectLiquidEtherBalance(state);
      balance = subtractBigNumbers([fullBalance, gasCostEth]);
      break;
  }

  if (balance) {
    const balanceFromUlps = convertFromUlps(balance).toString();
    yield put(actions.txUserFlowInvestment.updateValue(balanceFromUlps))
  }
}

export const txUserFlowInvestmentSagas = function* (): Iterator<any> {
  yield fork(neuTakeLatest, actions.investmentFlow.startInvestment, initInvestmentView);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.updateValue, updateInvestmentView);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.investEntireBalance, investEntireBalance);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.submitInvestment, submitInvestment);
  yield fork(neuTakeLatest, actions.txSender.txSenderHideModal, cleanupInvestmentView);
};

//fixme move those to utils
export const isIcbmInvestment = (investmentType: EInvestmentType) =>
  investmentType === EInvestmentType.ICBMEth || investmentType === EInvestmentType.ICBMnEuro;

const hasFunds = (input: string) => {
  return compareBigNumbers(input, "0") > 0
};
