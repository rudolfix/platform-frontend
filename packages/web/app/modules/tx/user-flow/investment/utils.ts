import BigNumber from "bignumber.js";
import { includes } from "lodash/fp";

import { WalletSelectionData } from "../../../../components/modals/tx-sender/investment-flow/InvestmentTypeSelector";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  selectDecimalPlaces,
  toFixedPrecision,
} from "../../../../components/shared/formatters/utils";
import { DEFAULT_INVESTMENT_TYPE, Q18 } from "../../../../config/constants";
import { TEtoSpecsData } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TBigNumberVariants } from "../../../../lib/web3/types";
import { Dictionary } from "../../../../types";
import { assertNever } from "../../../../utils/assertNever";
import { compareBigNumbers } from "../../../../utils/BigNumberUtils";
import { ICalculatedContribution, IInvestorTicket } from "../../../investor-portfolio/types";
import { MIMIMUM_RETAIL_TICKET_EUR_ULPS } from "../../../investor-portfolio/utils";
import { isEthInvestment } from "../../transactions/investment/selectors";
import { EInvestmentCurrency, EInvestmentValueType, EInvestmentWallet } from "./types";

export const isIcbmInvestment = (investmentWallet: EInvestmentWallet) =>
  investmentWallet === EInvestmentWallet.ICBMEth ||
  investmentWallet === EInvestmentWallet.ICBMnEuro;

export const hasFunds = (input: string) => compareBigNumbers(input, "0") > 0;

export type TCreateWalletsInput = {
  lockedBalanceNEuro: string;
  balanceNEur: string;
  icbmBalanceNEuro: string;
  ethBalance: string;
  lockedBalanceEth: string;
  icbmBalanceEth: string;
  ethBalanceAsEuro: string;
  icbmBalanceEthAsEuro: string;
  activeInvestmentTypes: EInvestmentWallet[];
};

export function createWallets({
  lockedBalanceNEuro,
  balanceNEur,
  icbmBalanceNEuro,
  ethBalance,
  lockedBalanceEth,
  icbmBalanceEth,
  ethBalanceAsEuro,
  icbmBalanceEthAsEuro,
  activeInvestmentTypes,
}: TCreateWalletsInput): WalletSelectionData[] {
  const wallets: Dictionary<WalletSelectionData> = {
    [EInvestmentWallet.Eth]: {
      balanceEth: ethBalance,
      balanceEur: ethBalanceAsEuro,
      type: EInvestmentWallet.Eth,
      name: "ETH Balance",
      enabled: false,
      hasFunds: ethBalance !== "0",
    },
    [EInvestmentWallet.NEur]: {
      balanceNEuro: balanceNEur,
      balanceEur: balanceNEur,
      type: EInvestmentWallet.NEur,
      name: "nEUR Balance",
      enabled: false,
      hasFunds: balanceNEur !== "0",
    },
    [EInvestmentWallet.ICBMnEuro]: {
      type: EInvestmentWallet.ICBMnEuro,
      name: "ICBM Balance",
      balanceNEuro: lockedBalanceNEuro,
      balanceEur: lockedBalanceNEuro,
      icbmBalanceNEuro: icbmBalanceNEuro,
      icbmBalanceEur: icbmBalanceNEuro,
      hasFunds: icbmBalanceNEuro !== "0" || lockedBalanceNEuro !== "0",
      enabled: false,
    },
    [EInvestmentWallet.ICBMEth]: {
      type: EInvestmentWallet.ICBMEth,
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
      .filter(w => w.hasFunds)
      // filter not enabled wallets that are not ICBM in current investment flow
      .filter(w => isICBMWallet(w.type) || w.enabled)
  );
}

export const getInvestmentCurrency = (investmentWallet: EInvestmentWallet) => {
  switch (investmentWallet) {
    case EInvestmentWallet.Eth:
    case EInvestmentWallet.ICBMEth:
      return EInvestmentCurrency.ETH;
    case EInvestmentWallet.NEur:
    case EInvestmentWallet.ICBMnEuro:
      return EInvestmentCurrency.EUR_TOKEN;
    default:
      return assertNever(investmentWallet);
  }
};

function isICBMWallet(type: EInvestmentWallet): boolean {
  return includes(type, [EInvestmentWallet.ICBMnEuro, EInvestmentWallet.ICBMEth]);
}

export const formatMinMaxTickets = (value: TBigNumberVariants, roundingMode: ERoundingMode) =>
  //todo find out why in `selectDecimalPlaces(ECurrency.EUR,...)`  currency is always eur
  toFixedPrecision({
    value,
    inputFormat: ENumberInputFormat.ULPS,
    outputFormat: ENumberOutputFormat.FULL,
    decimalPlaces: selectDecimalPlaces(ECurrency.EUR, ENumberOutputFormat.FULL),
    roundingMode: roundingMode,
  });

export const getInvestmentType = (wallets: WalletSelectionData[]): EInvestmentWallet => {
  if (!wallets.find((wallet: WalletSelectionData) => wallet.type === DEFAULT_INVESTMENT_TYPE)) {
    return wallets[0].type;
  } else {
    return DEFAULT_INVESTMENT_TYPE;
  }
};

export type TCalculateTicketLimitsUlps = {
  contribution: ICalculatedContribution;
  eto: TEtoSpecsData;
  investorTicket: IInvestorTicket | undefined;
};

export const calculateTicketLimitsUlps = ({
  contribution,
  eto,
  investorTicket,
}: TCalculateTicketLimitsUlps) => {
  const zero = new BigNumber("0");

  // todo: check if contrib is ever undefined and simplify this condition
  let min =
    new BigNumber(contribution.minTicketEurUlps) ||
    (eto.minTicketEur ? Q18.mul(eto.minTicketEur.toString()) : zero);
  let max =
    new BigNumber(contribution.maxTicketEurUlps) ||
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

export const getCurrencyByInvestmentType = (type: EInvestmentWallet) => {
  switch (type) {
    case EInvestmentWallet.NEur:
    case EInvestmentWallet.ICBMnEuro:
      return ECurrency.EUR_TOKEN;
    case EInvestmentWallet.Eth:
    case EInvestmentWallet.ICBMEth:
      return ECurrency.ETH;
  }
};

export const chooseTransactionValue = (
  investmentValueType: EInvestmentValueType,
  investmentType: EInvestmentWallet,
  ethValueUlps: string,
  euroValueUlps: string,
) => {
  if (investmentValueType === EInvestmentValueType.FULL_BALANCE) {
    return new BigNumber("0");
  } else {
    return new BigNumber(isEthInvestment(investmentType) ? ethValueUlps : euroValueUlps);
  }
};
