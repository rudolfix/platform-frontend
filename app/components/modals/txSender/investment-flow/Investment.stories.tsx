import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EInvestmentType } from "../../../../modules/investmentFlow/reducer";
import { InvestmentSelectionComponent } from "./Investment";

import * as ethIcon from "../../../../assets/img/eth_icon2.svg";
import * as euroIcon from "../../../../assets/img/euro_icon.svg";
import * as neuroIcon from "../../../../assets/img/neuro_icon.svg";

const wallets = [
  {
    balanceEth: "30000000000000000000",
    type: EInvestmentType.ICBMEth,
    name: "ICBM Wallet",
    icon: ethIcon
  },
  {
    balanceNEuro: "45600000000000000000",
    balanceEur: "45600000000000000000",
    type: EInvestmentType.ICBMnEuro,
    name: "ICBM Wallet",
    icon: neuroIcon
  },
  {
    balanceEth: "50000000000000000000",
    balanceEur: "45600000000000000000",
    type: EInvestmentType.InvestmentWallet,
    name: "Investment Wallet",
    icon: ethIcon
  },
  {
    type: EInvestmentType.BankTransfer,
    name: "Direct Bank Transfer",
    icon: euroIcon
  },
];

const dummyProps = {
  getTransaction: () => {},
  setEthValue: () => {},
  setEuroValue: () => {},
  setInvestmentType: () => {},
  onAccept: () => {},
  euroValue: "1000000000",
  etherPriceEur: "100",
  errorState: "fufu",
  investmentType: EInvestmentType.InvestmentWallet,
  gasPrice: "10000000"
}

storiesOf("InvestmentSelection", module).add("default", () =>
  <InvestmentSelectionComponent wallets={wallets} investmentType={EInvestmentType.InvestmentWallet} {...dummyProps} />
);
