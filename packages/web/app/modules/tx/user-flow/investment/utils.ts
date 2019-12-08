import { EInvestmentType } from "../../../investment-flow/reducer";
import { compareBigNumbers } from "../../../../utils/BigNumberUtils";
import { WalletSelectionData } from "../../../../components/modals/tx-sender/investment-flow/InvestmentTypeSelector";
import { Dictionary } from "../../../../types";
import { TBigNumberVariants } from "../../../../lib/web3/types";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode, selectDecimalPlaces,
  toFixedPrecision
} from "../../../../components/shared/formatters/utils";
import { assertNever } from "../../../../utils/assertNever";
import { includes } from "lodash/fp";
import { EInvestmentCurrency } from "../../../../components/modals/tx-sender/investment-flow/utils";

export const isIcbmInvestment = (investmentType: EInvestmentType) =>
  investmentType === EInvestmentType.ICBMEth || investmentType === EInvestmentType.ICBMnEuro;

export const hasFunds = (input: string) => {
  return compareBigNumbers(input, "0") > 0
};

export type TCreateWalletsInput = {
  lockedBalanceNEuro:string,
  balanceNEur:string,
  icbmBalanceNEuro:string,
  ethBalance:string,
  lockedBalanceEth:string,
  icbmBalanceEth:string,
  ethBalanceAsEuro:string,
  icbmBalanceEthAsEuro:string,
  activeInvestmentTypes: EInvestmentType[]
}

export function createWallets({
  lockedBalanceNEuro,
  balanceNEur,
  icbmBalanceNEuro,
  ethBalance,
  lockedBalanceEth,
  icbmBalanceEth,
  ethBalanceAsEuro,
  icbmBalanceEthAsEuro,
  activeInvestmentTypes
}:TCreateWalletsInput): WalletSelectionData[] {

  const wallets: Dictionary<WalletSelectionData> = {
    [EInvestmentType.Eth]: {
      balanceEth: ethBalance,
      balanceEur:   ethBalanceAsEuro,
      type: EInvestmentType.Eth,
      name: "ETH Balance",
      enabled: false,
      hasFunds: ethBalance !== "0",
    },
    [EInvestmentType.NEur]: {
      balanceNEuro: balanceNEur,
      balanceEur: balanceNEur,
      type: EInvestmentType.NEur,
      name: "nEUR Balance",
      enabled: false,
      hasFunds: balanceNEur !== "0",
    },
    [EInvestmentType.ICBMnEuro]: {
      type: EInvestmentType.ICBMnEuro,
      name: "ICBM Balance",
      balanceNEuro: lockedBalanceNEuro,
      balanceEur: lockedBalanceNEuro,
      icbmBalanceNEuro: icbmBalanceNEuro,
      icbmBalanceEur: icbmBalanceNEuro,
      hasFunds: icbmBalanceNEuro !== "0" || lockedBalanceNEuro !== "0",
      enabled: false,
    },
    [EInvestmentType.ICBMEth]: {
      type: EInvestmentType.ICBMEth,
      name: "ICBM Balance",
      balanceEth: lockedBalanceEth,
      balanceEur:   ethBalanceAsEuro,
      icbmBalanceEth: icbmBalanceEth,
      icbmBalanceEur: icbmBalanceEthAsEuro,
      hasFunds: icbmBalanceEth !== "0" || lockedBalanceEth !== "0",
      enabled: false,
    },
  };

  const walletsList = Object.keys(wallets);

  return (
    walletsList
      .map(w => ({ ...wallets[w], enabled: activeInvestmentTypes.some(v => v === w) }))
      // .map(w => {console.log("1:",w);return w})
      .filter(w => w.hasFunds)
      // .map(w => {console.log("2:",w);return w})

      // filter not enabled wallets that are not ICBM in current investment flow
      .filter(w => isICBMWallet(w.type) || w.enabled)
  );
}

export const getInvestmentCurrency = (investmentType: EInvestmentType) => {
  switch (investmentType) {
    case EInvestmentType.Eth:
    case EInvestmentType.ICBMEth:
      return EInvestmentCurrency.ETH;
    case EInvestmentType.NEur:
    case EInvestmentType.ICBMnEuro:
      return EInvestmentCurrency.EUR_TOKEN;
    default:
      return assertNever(investmentType);
  }
};

function isICBMWallet(type: EInvestmentType): boolean {
  return includes(type, [EInvestmentType.ICBMnEuro, EInvestmentType.ICBMEth]);
}


export const formatMinMaxTickets = (value: TBigNumberVariants, roundingMode: ERoundingMode) =>
  toFixedPrecision({
    value,
    inputFormat: ENumberInputFormat.ULPS,
    outputFormat: ENumberOutputFormat.FULL,
    decimalPlaces: selectDecimalPlaces(ECurrency.EUR, ENumberOutputFormat.FULL),
    roundingMode: roundingMode,
  });
