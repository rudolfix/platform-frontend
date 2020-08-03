import {
  EKycInstantIdProvider,
  EKycRequestStatus,
  EKycRequestType,
  ETransactionDirection,
  ETransactionStatus,
  ETransactionType,
  EUserType,
  EWalletSubType,
  EWalletType,
  IUserState,
  IWalletStateData,
  kycApi,
} from "@neufund/shared-modules";
import {
  convertFromUlps,
  ECountries,
  ECurrency,
  ENumberInputFormat,
  EquityToken,
  EthereumAddressWithChecksum,
  EthereumTxHash,
} from "@neufund/shared-utils";

import { ETxType } from "../../lib/web3/types";
import { EInvestmentType } from "../investment-flow/reducer";
import { ETxSenderState } from "../tx/sender/reducer";
import { IConnectedWeb3State } from "../web3/reducer";
import { EBalanceViewType } from "./types";

export const testBankAccount = {
  hasBankAccount: true,
  details: {
    bankAccountNumberLast4: "1234",
    bankName: "mBank",
    name: "Lorem Ipsum",
    isSepa: true,
    swiftCode: "33212",
  },
} as const;

export const emptyWalletData = [
  {
    name: EBalanceViewType.ETH,
    hasFunds: false,
    amount: "0",
    euroEquivalentAmount: "0",
  },
  {
    name: EBalanceViewType.NEUR,
    hasFunds: false,
    amount: "0",
    euroEquivalentAmount: "0",
  },
  {
    name: EBalanceViewType.ICBM_ETH,
    hasFunds: false,
    amount: "0",
    euroEquivalentAmount: "0",
  },
  {
    name: EBalanceViewType.ICBM_NEUR,
    hasFunds: false,
    amount: "0",
    euroEquivalentAmount: "0",
  },
  {
    name: EBalanceViewType.LOCKED_ICBM_ETH,
    hasFunds: false,
    amount: "0",
    euroEquivalentAmount: "0",
  },
  {
    name: EBalanceViewType.LOCKED_ICBM_NEUR,
    hasFunds: false,
    amount: "0",
    euroEquivalentAmount: "0",
  },
];

export const walletData = [
  {
    name: EBalanceViewType.ETH,
    hasFunds: true,
    amount: "386635441865000003000",
    euroEquivalentAmount: convertFromUlps("7.185643883006235505906790797322021e+22").toString(),
  },
  {
    name: EBalanceViewType.NEUR,
    hasFunds: true,
    amount: "87654",
    euroEquivalentAmount: convertFromUlps("87654").toString(),
  },
  {
    name: EBalanceViewType.ICBM_ETH,
    hasFunds: false,
    amount: "0",
    euroEquivalentAmount: "0",
  },
  {
    name: EBalanceViewType.ICBM_NEUR,
    hasFunds: false,
    amount: "0",
    euroEquivalentAmount: "0",
  },
  {
    name: EBalanceViewType.LOCKED_ICBM_ETH,
    hasFunds: true,
    amount: "23456",
    euroEquivalentAmount: convertFromUlps("4359312.27894635108192").toString(),
  },
  {
    name: EBalanceViewType.LOCKED_ICBM_NEUR,
    hasFunds: false,
    amount: "0",
    euroEquivalentAmount: "0",
  },
];

export const testWallet = {
  loading: false,
  error: undefined,
  data: {
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

    etherTokenBalance: "3000",
    euroTokenBalance: "87654",
    etherBalance: "386635441865000000000",
    neuBalance: "0",

    euroTokenICBMLockedWallet: {
      LockedBalance: "0",
      neumarksDue: "0",
      unlockDate: "0",
    },
    etherTokenICBMLockedWallet: {
      LockedBalance: "23456",
      neumarksDue: "0",
      unlockDate: "0",
    },
    etherTokenUpgradeTarget: "0x295a803de79cd256ff544682a51435e549a080b2",
    euroTokenUpgradeTarget: "0x295a803de79cd256ff544682a51435e549a080b2",
    neumarkAddress: "0x295a803de79cd256ff544682a51435e549a080b2",
  } as IWalletStateData,
};

export const testTokenPrice = {
  loading: false,
  tokenPriceData: {
    etherPriceEur: "185.85062580774007",
    neuPriceEur: "0.14549197443137551",
    eurPriceEther: "0.00538066522861476",
    priceOutdated: false,
  },
};

export const testUser = {
  data: {
    backupCodesVerified: true,
    language: "en",
    latestAcceptedTosIpfs: "QmP8jRt4NEQo51Kn1tbEyD6kVs4vBGge5vJZsNzU8rATVD",
    type: EUserType.INVESTOR,
    userId: "0x0D54192b7C8F126DCd946Ffd03E336B24052EdF2",
    verifiedEmail: "0x0d541@neufund.org",
    walletSubtype: "METAMASK",
    walletType: "BROWSER",
  },
} as IUserState;

export const testKyc = ({
  status: {
    inProhibitedRegion: false,
    instantIdProvider: "none",
    originCountry: ECountries.BRAZIL,
    recommendedInstantIdProvider: EKycInstantIdProvider.ONFIDO,
    status: EKycRequestStatus.ACCEPTED,
    type: EKycRequestType.INDIVIDUAL,
    supportedInstantIdProviders: [EKycInstantIdProvider.ID_NOW, EKycInstantIdProvider.ONFIDO],
  },
  claims: {
    isVerified: true,
    isSophisticatedInvestor: false,
    hasBankAccount: true,
    isAccountFrozen: false,
  },
  individualData: {
    isHighIncome: false,
    isPoliticallyExposed: false,
    zipCode: "11000",
    city: "Berlin",
    street: "Michaelkirchstr. 56",
    id: "0x0D54192b7C8F126DCd946Ffd03E336B24052EdF2",
    placeOfBirth: "DE",
    nationality: "DE",
    lastName: "Goldsmith",
    firstName: "Peter",
    country: "DE",
    birthDate: "2000-1-1",
  },
  bankAccount: testBankAccount,
} as unknown) as ReturnType<typeof kycApi.reducerMap.kyc>;

export const testWeb3 = {
  connected: true,
  wallet: {
    address: "0x0D54192b7C8F126DCd946Ffd03E336B24052EdF2",
    walletType: EWalletType.BROWSER,
    walletSubType: EWalletSubType.METAMASK,
  },
  web3Available: false,
} as IConnectedWeb3State;

export const loadWalletViewContext = {
  apiKycService: {
    getBankAccount: () => {},
  },
  notificationCenter: {
    error: () => {},
  },
  logger: {
    error: () => {},
    info: () => {},
  },
};

export const resultBalanceData = [
  {
    name: EBalanceViewType.ETH,
    hasFunds: true,
    amount: "386635441865000003000",
    euroEquivalentAmount: convertFromUlps("7.185643883006235505906790797322021e+22").toString(),
  },
  {
    name: EBalanceViewType.NEUR,
    hasFunds: true,
    amount: "87654",
    euroEquivalentAmount: convertFromUlps("87654").toString(),
  },
  {
    name: EBalanceViewType.LOCKED_ICBM_ETH,
    hasFunds: true,
    amount: "23456",
    euroEquivalentAmount: convertFromUlps("4359312.27894635108192").toString(),
  },
];

export const ethTransfer = {
  amount: "10000000000000000",
  amountFormat: ENumberInputFormat.ULPS,
  blockNumber: 1117,
  date: "2020-06-25T02:24:16Z",
  id: "1117_0_256",
  logIndex: 256,
  transactionDirection: ETransactionDirection.IN,
  transactionIndex: 0,
  txHash: "0xf0575b9deaea89806d3b1ed0f7f9dcab1f586caa6e71b5e3f0bb9b7bde8273c7" as EthereumTxHash,
  currency: ECurrency.ETH,
  amountEur: "1947504021193054200",
  subType: undefined,
  type: ETransactionType.TRANSFER,
  toAddress: "0x619f0a73f02b8ac8F58440c21E15A461E69011a5" as EthereumAddressWithChecksum,
  fromAddress: "0x29c57b5F27b249Ab3c11Badf6efc4B2308bc75Dd" as EthereumAddressWithChecksum,
} as const;

export const neuTransfer = {
  amount: "5.696684312533562e+24",
  amountFormat: ENumberInputFormat.ULPS,
  blockNumber: 132,
  date: "2020-06-25T02:17:22Z",
  id: "132_0_8",
  logIndex: 8,
  transactionDirection: ETransactionDirection.IN,
  transactionIndex: 0,
  txHash: "0x21cb1d2c0eba7e8968915f1687f067a3874261b66d2ea66acb6ac5de8347015c" as EthereumTxHash,
  currency: ECurrency.NEU,
  amountEur: "7.3644713102730998648445536369724e+23",
  subType: undefined,
  type: ETransactionType.TRANSFER,
  toAddress: "0x619f0a73f02b8ac8F58440c21E15A461E69011a5" as EthereumAddressWithChecksum,
  fromAddress: "0x238f2bEFB74CF762346341a525a4C548f5e2e386" as EthereumAddressWithChecksum,
} as const;

export const neuroSend = {
  amount: "1.781267e+24",
  amountFormat: ENumberInputFormat.ULPS,
  blockNumber: 132,
  date: "2020-06-25T02:17:22Z",
  id: "132_0_1",
  logIndex: 1,
  transactionDirection: ETransactionDirection.OUT,
  transactionIndex: 0,
  txHash: "0xea3145cf6334a8fe5a9570c05fef7ebb2b3c728369fccae5cf8f30809d99be94" as EthereumTxHash,
  currency: ECurrency.EUR_TOKEN,
  amountEur: "1.781267e+24",
  subType: undefined,
  type: ETransactionType.TRANSFER,
  toAddress: "0x238f2bEFB74CF762346341a525a4C548f5e2e386" as EthereumAddressWithChecksum,
  fromAddress: "0x619f0a73f02b8ac8F58440c21E15A461E69011a5" as EthereumAddressWithChecksum,
} as const;

export const pendingTx = {
  transaction: {
    from: "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988" as EthereumAddressWithChecksum,
    gas: "0xe890",
    gasPrice: "0xd693a400",
    hash: "0x0000000000000000000000000000000000000000000000000000000000000000" as EthereumTxHash,
    input:
      "0x64663ea600000000000000000000000016cd5ac5a1b77fb72032e3a09e91a98bb21d89880000000000000000000000000000000000000000000000008ac7230489e80000",
    nonce: "0x0",
    to: "0xf538ca71b753e5fa634172c133e5f40ccaddaa80" as EthereumAddressWithChecksum,
    value: "0x1",
    blockHash: undefined,
    blockNumber: undefined,
    chainId: undefined,
    status: undefined,
    transactionIndex: undefined,
    failedRpcError: undefined,
  },
  transactionAdditionalData: {
    to: "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988" as EthereumAddressWithChecksum,
    total: "10000000000000000000",
    amount: "10000000000000000000",
    amountEur: undefined,
    totalEur: "10000000000000000000",
    tokenSymbol: "QTT" as EquityToken,
    tokenImage: "test",
    tokenDecimals: 18,
    companyName: "Blokke",
    transactionDirection: ETransactionDirection.OUT,
    investmentType: EInvestmentType.NEur,
    type: ETransactionType.TRANSFER,
    currency: "QTT",
    isICBMInvestment: undefined,
    equityTokenCurrency: undefined,
    subType: ETransactionStatus.PENDING,
    amountFormat: ENumberInputFormat.ULPS,
  },
  transactionStatus: ETxSenderState.MINING,
  transactionTimestamp: 1553762875525,
  transactionType: ETxType.WITHDRAW,
  transactionError: undefined,
};

export const testEthAddress = "0x0D54192b7C8F126DCd946Ffd03E336B24052EdF2" as EthereumAddressWithChecksum;
