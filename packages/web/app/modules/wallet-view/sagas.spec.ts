import { expectSaga, matchers } from "@neufund/sagas/tests";
import {
  authModuleAPI,
  EKycInstantIdProvider,
  EKycRequestStatus,
  EKycRequestType,
  EUserType,
  EWalletSubType,
  EWalletType,
  IUserState,
  IWalletStateData,
  kycApi,
  tokenPriceModuleApi,
  walletApi,
} from "@neufund/shared-modules";
import { convertFromUlps, ECountries, EthereumAddressWithChecksum } from "@neufund/shared-utils";
import { combineReducers } from "redux";

import { EProcessState } from "../../utils/enums/processStates";
import { actions } from "../actions";
import { IConnectedWeb3State, web3Reducer } from "../web3/reducer";
import { loadWalletView, populateWalletData } from "./sagas";
import { EBalanceViewType } from "./types";

const emptyWalletData = [
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

const walletData = [
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

const wallet = {
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

    etherTokenBalance: "0",
    euroTokenBalance: "0",
    etherBalance: "0",
    neuBalance: "0",

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
    etherTokenUpgradeTarget: "0x295a803de79cd256ff544682a51435e549a080b2",
    euroTokenUpgradeTarget: "0x295a803de79cd256ff544682a51435e549a080b2",
    neumarkAddress: "0x295a803de79cd256ff544682a51435e549a080b2",
  } as IWalletStateData,
};

const tokenPrice = {
  loading: false,
  tokenPriceData: {
    etherPriceEur: "185.85062580774007",
    neuPriceEur: convertFromUlps("0.14549197443137551").toString(),
    eurPriceEther: "0.00538066522861476",
    priceOutdated: false,
  },
};

const user = {
  data: {
    backupCodesVerified: true,
    language: "en",
    latestAcceptedTosIpfs: "QmP8jRt4NEQo51Kn1tbEyD6kVs4vBGge5vJZsNzU8rATVD",
    type: "investor",
    userId: "0x0D54192b7C8F126DCd946Ffd03E336B24052EdF2",
    verifiedEmail: "0x0d541@neufund.org",
    walletSubtype: "METAMASK",
    walletType: "BROWSER",
  },
} as IUserState;

const kyc = ({
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
} as unknown) as ReturnType<typeof kycApi.reducerMap.kyc>;

const web3 = {
  connected: true,
  wallet: {
    address: "0x0D54192b7C8F126DCd946Ffd03E336B24052EdF2",
    walletType: EWalletType.BROWSER,
    walletSubType: EWalletSubType.METAMASK,
  },
  web3Available: false,
} as IConnectedWeb3State;

describe("Wallet View", () => {
  describe("populateWalletData()", () => {
    it("will populate wallet data, no funds anywhere", async () => {
      await expectSaga(populateWalletData)
        .withReducer(
          combineReducers({
            tokenPrice: tokenPriceModuleApi.reducer.tokenPrice,
            user: authModuleAPI.reducer.user,
            kyc: kycApi.reducerMap.kyc,
            wallet: walletApi.reducer.wallet,
            web3: web3Reducer,
          }),
          {
            tokenPrice,
            user,
            kyc,
            wallet,
            web3,
          },
        )
        .returns(emptyWalletData)
        .run();
    });
    it("will populate wallet data, some have funds anywhere", async () => {
      await expectSaga(populateWalletData)
        .withReducer(
          combineReducers({
            tokenPrice: tokenPriceModuleApi.reducer.tokenPrice,
            user: authModuleAPI.reducer.user,
            kyc: kycApi.reducerMap.kyc,
            wallet: walletApi.reducer.wallet,
            web3: web3Reducer,
          }),
          {
            tokenPrice,
            user,
            kyc,
            web3,
            wallet: {
              loading: false,
              error: undefined,
              data: {
                ...wallet.data,
                etherTokenBalance: "3000",
                euroTokenBalance: "87654",
                etherBalance: "386635441865000000000",
                neuBalance: "0",
                etherTokenICBMLockedWallet: {
                  LockedBalance: "23456",
                  neumarksDue: "0",
                  unlockDate: "0",
                },
              } as IWalletStateData,
            },
          },
        )
        .returns(walletData)
        .run();
    });
  });
  describe("loadWalletView()", () => {
    const ethAddress = "0x295a803de79cd256ff544682a51435e549a080b2" as EthereumAddressWithChecksum;
    const bankAccount = {
      hasBankAccount: true,
      details: {
        bankAccountNumberLast4: "1234",
        bankName: "mBank",
        name: "Lorem Ipsum",
        isSepa: true,
        swiftCode: "33212",
      },
    } as const;

    it("loadWalletView", async () => {
      const context = {
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

      const resultBalanceData = [
        {
          name: EBalanceViewType.ETH,
          hasFunds: true,
          amount: "386635441865000003000",
          euroEquivalentAmount: convertFromUlps(
            "7.185643883006235505906790797322021e+22",
          ).toString(),
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

      await expectSaga(loadWalletView)
        .withState({
          user: {
            data: {
              type: EUserType.INVESTOR,
              verifiedEmail: "sdafas@dsafasdf.dd",
              backupCodesVerified: true,
            },
          },
          web3: {
            connected: true,
            wallet: { address: ethAddress },
          },
          kyc: {
            bankAccount,
            status: { status: EKycRequestStatus.ACCEPTED },
            claims: {
              isVerified: true,
              isAccountFrozen: false,
            },
          },
        })
        .provide([
          [matchers.getContext("deps"), context],
          [matchers.call.fn(walletApi.sagas.loadWalletDataSaga), undefined],
          [matchers.call.fn(kycApi.sagas.loadBankAccountDetails), undefined],
          [matchers.call.fn(populateWalletData), walletData],
        ])
        .put(
          actions.walletView.walletViewSetData({
            userIsFullyVerified: true,
            userAddress: ethAddress,
            balanceData: resultBalanceData,
            totalBalanceEuro: convertFromUlps(
              "7.185643883006235950603418691957129192e+22",
            ).toString(),
            bankAccount: bankAccount,
            processState: EProcessState.SUCCESS,
          }),
        )
        .run();
    });
  });
});
