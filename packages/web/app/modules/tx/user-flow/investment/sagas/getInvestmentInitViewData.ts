import { all, call, select } from "redux-saga/effects";

import { WalletSelectionData } from "../../../../../components/modals/tx-sender/investment-flow/InvestmentTypeSelector";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  formatNumber,
  selectDecimalPlaces,
} from "../../../../../components/shared/formatters/utils";
import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { nonNullable } from "../../../../../utils/nonNullable";
import {
  selectEtoTokenGeneralDiscounts,
  selectEtoTokenStandardPrice,
  selectEtoWithCompanyAndContractById,
} from "../../../../eto/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../../../eto/types";
import {
  selectHasInvestorTicket,
  selectPersonalDiscount,
} from "../../../../investor-portfolio/selectors";
import { selectEurPriceEther } from "../../../../shared/tokenPrice/selectors";
import { selectTxUserFlowInvestmentEtoId } from "../selectors";
import { EInvestmentFormState, EInvestmentValueType } from "../types";
import { getInvestmentCurrency, getInvestmentType } from "../utils";
import { generateWalletsData } from "./generateWalletsViewData";
import { getTicketSizes } from "./getTicketSizes";
import { preloadInvestmentData } from "./preloadInvestmentData";

export function* getInvestmentInitViewData(_: TGlobalDependencies): Generator<any, any, any> {
  const etoId = yield select(selectTxUserFlowInvestmentEtoId);
  const eto: TEtoWithCompanyAndContractReadonly = nonNullable(
    yield select(selectEtoWithCompanyAndContractById, etoId),
  );

  yield call(preloadInvestmentData, eto);

  const wallets: WalletSelectionData[] = yield call(generateWalletsData);
  const investmentWallet = yield call(getInvestmentType, wallets);
  const investmentCurrency = yield call(getInvestmentCurrency, investmentWallet);

  const initialDefaultValues = {
    eto,
    wallets,
    investmentValue: "",
    euroValueWithFallback: "0",
    investmentWallet,
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

  const { minTicketEur, minTicketEth } = yield call(getTicketSizes, {
    eto,
    euroValueUlps: "0",
    investmentWallet,
    eurPriceEther,
  });

  const minEthTicketFormatted = yield call(formatNumber, {
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
