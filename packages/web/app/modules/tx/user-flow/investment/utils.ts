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
import { EInvestmentCurrency } from "./reducer";
import { DEFAULT_INVESTMENT_TYPE, Q18 } from "../../../../config/constants";
import BigNumber from "bignumber.js";
import { MIMIMUM_RETAIL_TICKET_EUR_ULPS } from "../../../investor-portfolio/utils";
import { ICalculatedContribution, IInvestorTicket } from "../../../investor-portfolio/types";
import { TEtoSpecsData } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";

export const isIcbmInvestment = (investmentType: EInvestmentType) =>
  investmentType === EInvestmentType.ICBMEth || investmentType === EInvestmentType.ICBMnEuro;

export const hasFunds = (input: string) => {
  return compareBigNumbers(input, "0") > 0
};

export type TCreateWalletsInput = {
  lockedBalanceNEuro: string,
  balanceNEur: string,
  icbmBalanceNEuro: string,
  ethBalance: string,
  lockedBalanceEth: string,
  icbmBalanceEth: string,
  ethBalanceAsEuro: string,
  icbmBalanceEthAsEuro: string,
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
}: TCreateWalletsInput): WalletSelectionData[] {

  const wallets: Dictionary<WalletSelectionData> = {
    [EInvestmentType.Eth]: {
      balanceEth: ethBalance,
      balanceEur: ethBalanceAsEuro,
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
      balanceEur: ethBalanceAsEuro,
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

export const mapInvestmentCurrency = (investmentCurrency:EInvestmentCurrency) =>
  ({
    [EInvestmentCurrency.ETH]: ECurrency.ETH,
    [EInvestmentCurrency.EUR_TOKEN]:ECurrency.EUR_TOKEN
  })[investmentCurrency];


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

export const getInvestmentType = (wallets: WalletSelectionData[]): EInvestmentType => {
  if (!wallets.find((wallet: WalletSelectionData) => wallet.type === DEFAULT_INVESTMENT_TYPE)) {
    return wallets[0].type
  } else {
    return DEFAULT_INVESTMENT_TYPE
  }
};

export type TCalculateTicketLimitsUlps = {
  contribution:ICalculatedContribution,
  eto:TEtoSpecsData,
  investorTicket:IInvestorTicket | undefined
}

export const calculateTicketLimitsUlps = ({
  contribution,
  eto,
  investorTicket
}:TCalculateTicketLimitsUlps) => {
  const zero = new BigNumber("0");

  // todo: check if contrib is ever undefined and simplify this condition
  let min =
    (new BigNumber(contribution.minTicketEurUlps)) ||
    (eto.minTicketEur ? Q18.mul(eto.minTicketEur.toString()) : zero);
  let max =
    (new BigNumber(contribution.maxTicketEurUlps)) ||
    (eto.maxTicketEur ? Q18.mul(eto.maxTicketEur.toString()) : zero);

  const tokenPrice = eto.investmentCalculatedValues!.sharePrice / eto.equityTokensPerShare;

  if (investorTicket) {
    // todo: replace with price taken from smart contract
    max = BigNumber.max(max.sub(investorTicket.equivEurUlps), "0");
    // when already invested, you can invest less than minimum ticket however we set this value
    // to more than just one token: we have official retail min ticket at 10 EUR so use it
    min = BigNumber.max(
      min.sub(investorTicket.equivEurUlps),
      Q18.mul(tokenPrice.toString()),
      MIMIMUM_RETAIL_TICKET_EUR_ULPS,
    );
    // however it cannot be more than max
    min = BigNumber.min(max, min);
  }

  return {
    minTicketEurUlps: min,
    maxTicketEurUlps: max,
  };
};
