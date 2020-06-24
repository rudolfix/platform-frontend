import { EKycRequestStatus, EUserType, EWalletType } from "@neufund/shared-modules";
import { ETH_DECIMALS, toEquityTokenSymbol } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { CombinedState } from "redux";

import {
  dummyEthereumAddress,
  testCompany,
  testContract,
  testEto,
} from "../../../../../test/fixtures";
import { ETxType } from "../../../../lib/web3/types";
import { EETOStateOnChain } from "../../../../modules/eto/types";
import { EInvestmentType } from "../../../../modules/investment-flow/reducer";
import { ETxSenderState } from "../../../../modules/tx/sender/reducer";
import { EValidationState } from "../../../../modules/tx/validator/reducer";
import { TAppGlobalState } from "../../../../store";
import { withStore } from "../../../../utils/react-connected-components/storeDecorator.unsafe";
import { wallets } from "../investment-flow/InvestmentTypeSelector.stories";
import { TxSenderModalComponent } from "./TxSender";

import tokenIcon from "../../../../assets/img/token_icon.svg";

/*
 * TODO add all states of txSender
 *  (more copy-paste required :))
 * */

const props = {
  isOpen: true,
  state: ETxSenderState.ACCESSING_WALLET,
  type: ETxType.WITHDRAW,
  txHash: "af908098b968d7564564362c51836",
  blockId: 123,
  error: undefined,
  txTimestamp: 1580000255922,
  onCancel: action("cancel"),
};

const withdrawTxSenderState = {
  txDetails: {
    gasPrice: "1",
    gas: "856800000000000",
  },
  txHash: "af908098b968d7564564362c51836",
  additionalData: {
    to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
    amount: "5500000000000000000",
    amountEur: "5500000000000000000",
    total: "313131232312331212",
    totalEur: "313131232312331212",
    tokenSymbol: toEquityTokenSymbol("QTT"),
    tokenImage: tokenIcon,
    tokenDecimals: 18,
  },
};

const investmentTxSenderState = {
  txDetails: {
    gasPrice: "1",
    gas: "856800000000000",
  },
  txHash: "af908098b968d7564564362c51836",
  additionalData: {
    eto: {
      companyName: "X company",
      etoId: "0x123434562134asdf2412341234adf12341234",
      equityTokensPerShare: 0,
      sharePrice: 0,
      equityTokenInfo: {
        equityTokenSymbol: toEquityTokenSymbol("QTT"),
        equityTokenImage: tokenIcon,
        equityTokenName: "Quintessence",
      },
    },
    investmentType: EInvestmentType.NEur,
    investmentEth: "12345678900000000000",
    investmentEur: "12345678900000000000000",
    gasCostEth: "2000000000000000",
    equityTokens: "500",
    estimatedReward: "40000000000000000000",
    etherPriceEur: "200",
    isIcbm: false,
    tokenDecimals: ETH_DECIMALS,
  },
};

const lightWalletWeb3State = {
  connected: true,
  wallet: {
    walletType: EWalletType.LIGHT,
    address: dummyEthereumAddress,
  },
};

const browserWalletWeb3State = {
  connected: true,
  wallet: {
    walletType: EWalletType.BROWSER,
    address: dummyEthereumAddress,
  },
};

const ledgerWeb3State = {
  connected: true,
  wallet: {
    walletType: EWalletType.LEDGER,
    address: dummyEthereumAddress,
  },
};

const wcWeb3State = {
  connected: true,
  wallet: {
    walletType: EWalletType.WALLETCONNECT,
    address: dummyEthereumAddress,
  },
};

const baseStore = {
  accessWallet: {
    errorMessage: undefined,
  },
  user: {
    data: {
      type: EUserType.INVESTOR,
      verifiedEmail: "sdafas@dsafasdf.dd",
      backupCodesVerified: true,
    },
  },
  kyc: {
    statusLoading: true,
    status: { status: EKycRequestStatus.ACCEPTED },
    claims: { isVerified: true },
  },
  wallet: {
    data: {
      euroTokenICBMLockedWallet: {
        LockedBalance: "0",
        neumarksDue: "0",
        unlockDate: "0",
      },
      etherTokenICBMLockedWallet: {
        LockedBalance: "0",
        neumarksDue: "0",
        unlockDate: "0",
      },
      euroTokenLockedWallet: {
        LockedBalance: "0",
        neumarksDue: "0",
        unlockDate: "0",
      },
      etherTokenLockedWallet: {
        LockedBalance: "0",
        neumarksDue: "0",
        unlockDate: "0",
      },
      etherTokenUpgradeTarget: "",
      euroTokenUpgradeTarget: "",
      etherTokenBalance: "0",
      euroTokenBalance: "0",
      etherBalance: "0",
      neuBalance: "0",
    },
  },
  txUserFlowTransfer: {
    txUserTokenData: {
      tokenAddress: "",
      userBalance: "0",
      tokenSymbol: "",
      tokenImage: "",
      tokenDecimals: 0,
    },
    txUserFlowInputData: {
      to: dummyEthereumAddress,
      value: "1235",
    },
    txUserFlowDetails: {
      inputValue: "0",
      inputValueEuro: "0",
      inputTo: dummyEthereumAddress,
      totalValue: "856800000000000",
      totalValueEur: "177408295279691541.408",
      transactionCost: "856800000000000",
      transactionCostEur: "177408295279691541.408",
    },
  },
  txValidator: {
    validationState: EValidationState.NOT_ENOUGH_ETHER_FOR_GAS,
    notifications: [],
  },
  etoIssuer: {
    eto: testEto,
    company: testCompany,
  },
  eto: {
    etos: {
      [testEto.previewCode]: testEto,
    },
    companies: {
      [testEto.companyId]: testCompany,
    },
    contracts: {
      [testEto.previewCode]: { ...testContract, timedState: EETOStateOnChain.Public },
    },
    tokenGeneralDiscounts: {
      [testEto.etoId]: {
        whitelistDiscountFrac: 0.35,
        whitelistDiscountUlps: "296633323000000000",
        publicDiscountFrac: 0.25,
        publicDiscountUlps: "339009512000000000",
      },
    },
  },
  bookBuildingFlow: {
    pledges: {},
  },
  investmentFlow: {
    etoId: testEto.etoId,
    investmentType: EInvestmentType.Eth,
    wallets,
  },
  tokenPrice: {
    tokenPriceData: {
      etherPriceEur: "208.303195349147",
      neuPriceEur: "0.12956573087151566",
      eurPriceEther: "0.004800694479620689",
      priceOutdated: false,
    },
  },
  investorTickets: {
    calculatedContributions: {},
    initialCalculatedContributions: {},
    investorEtoTickets: {
      [testEto.etoId]: {
        equivEurUlps: "123243425",
      },
    },
    tokensDisbursal: { loading: false, error: false },
    incomingPayouts: { loading: false, error: false },
    tokensPersonalDiscounts: {
      [testEto.etoId]: {
        whitelistDiscountAmountLeft: "-1.043240344598e+23",
        whitelistDiscountUlps: "2301837474738",
        whitelistDiscountFrac: 0.5,
        whitelistDiscountAmountEurUlps: "2301837",
      },
    },
  },
};

const lightWalletStore = {
  ...baseStore,
  web3: lightWalletWeb3State,
};

const browserWalletStore = {
  ...baseStore,
  web3: browserWalletWeb3State,
};

const ledgerStore = {
  ...baseStore,
  web3: ledgerWeb3State,
};

const wcStore = {
  ...baseStore,
  web3: wcWeb3State,
};

storiesOf("TxSenderModal, lightWallet WITHDRAW", module)
  .addDecorator(
    withStore(({
      ...lightWalletStore,
      txSender: withdrawTxSenderState,
    } as unknown) as TAppGlobalState),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.WITHDRAW,
      }}
    />
  ));

storiesOf("TxSenderModal, lightWallet ETO_SET_DATE", module)
  .addDecorator(
    withStore(({
      ...lightWalletStore,
      txSender: withdrawTxSenderState,
    } as unknown) as CombinedState<unknown>),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ));

storiesOf("TxSenderModal, lightWallet INVEST", module)
  .addDecorator(
    withStore(({
      ...lightWalletStore,
      txSender: investmentTxSenderState,
    } as unknown) as TAppGlobalState),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.INVEST,
      }}
    />
  ));

storiesOf("TxSenderModal: browserWallet WITHDRAW", module)
  .addDecorator(
    withStore(({
      ...browserWalletStore,
      txSender: withdrawTxSenderState,
    } as unknown) as TAppGlobalState),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.WITHDRAW,
      }}
    />
  ));

storiesOf("TxSenderModal, browserWallet ETO_SET_DATE", module)
  .addDecorator(
    withStore(({
      ...browserWalletStore,
      txSender: withdrawTxSenderState,
    } as unknown) as TAppGlobalState),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ));

storiesOf("TxSenderModal, browserWallet INVEST", module)
  .addDecorator(
    withStore(({
      ...browserWalletStore,
      txSender: investmentTxSenderState,
    } as unknown) as TAppGlobalState),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.INVEST,
      }}
    />
  ));

storiesOf("TxSenderModal: ledger WITHDRAW", module)
  .addDecorator(
    withStore(({ ...ledgerStore, txSender: withdrawTxSenderState } as unknown) as TAppGlobalState),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.WITHDRAW,
      }}
    />
  ));

storiesOf("TxSenderModal, ledger ETO_SET_DATE", module)
  .addDecorator(
    withStore(({ ...ledgerStore, txSender: withdrawTxSenderState } as unknown) as TAppGlobalState),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ));

storiesOf("TxSenderModal, ledger INVEST", module)
  .addDecorator(
    withStore(({
      ...ledgerStore,
      txSender: investmentTxSenderState,
    } as unknown) as TAppGlobalState),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.INVEST,
      }}
    />
  ));

storiesOf("TxSenderModal: walletConnect WITHDRAW", module)
  .addDecorator(
    withStore(({ ...wcStore, txSender: withdrawTxSenderState } as unknown) as TAppGlobalState),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.WITHDRAW,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.WITHDRAW,
      }}
    />
  ));

storiesOf("TxSenderModal, walletConnect ETO_SET_DATE", module)
  .addDecorator(
    withStore(({ ...wcStore, txSender: withdrawTxSenderState } as unknown) as TAppGlobalState),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.ETO_SET_DATE,
      }}
    />
  ));

storiesOf("TxSenderModal, walletConnect INVEST", module)
  .addDecorator(
    withStore(({ ...wcStore, txSender: investmentTxSenderState } as unknown) as TAppGlobalState),
  )
  .add("ETxSenderState.WATCHING_PENDING_TXS", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.WATCHING_PENDING_TXS,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.INIT", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.INIT,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.SUMMARY", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SUMMARY,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.ACCESSING_WALLET", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ACCESSING_WALLET,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.SIGNING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.SIGNING,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.MINING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.MINING,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.DONE", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.DONE,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.ERROR_SIGN", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.ERROR_SIGN,
        type: ETxType.INVEST,
      }}
    />
  ))
  .add("ETxSenderState.LOADING", () => (
    <TxSenderModalComponent
      {...{
        ...props,
        state: ETxSenderState.LOADING,
        type: ETxType.INVEST,
      }}
    />
  ));
