import { callWithCount, takeWithCount, throwError } from "@neufund/sagas";
import { expectSaga, matchers } from "@neufund/sagas/tests";
import {
  authModuleAPI,
  EModuleStatus,
  kycApi,
  tokenPriceModuleApi,
  txHistoryApi,
  walletApi,
} from "@neufund/shared-modules";
import { convertFromUlps } from "@neufund/shared-utils";
import { combineReducers } from "redux";

import { EProcessState } from "../../utils/enums/processStates";
import { actions } from "../actions";
import { generalPendingTxFixture } from "../tx/utils";
import { web3Reducer } from "../web3/reducer";
import { walletViewReducer } from "./reducer";
import {
  loadInitialWalletView,
  populateBalanceData,
  populateTxHistory,
  populateWalletData,
  walletViewController,
} from "./sagas";
import {
  emptyWalletData,
  ethTransfer,
  neuroSend,
  neuTransfer,
  pendingTx,
  resultBalanceData,
  testBankAccount,
  testEthAddress,
  testKyc,
  testTokenPrice,
  testUser,
  testWallet,
  testWeb3,
  walletData,
} from "./sagas.specFixtures";
import { TWalletViewReadyState } from "./types";

const testStateCommon = {
  user: testUser,
  web3: testWeb3,
  kyc: testKyc,
};

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
            ...testStateCommon,
            tokenPrice: testTokenPrice,
            wallet: {
              ...testWallet,
              data: {
                ...testWallet.data,
                etherTokenBalance: "0",
                euroTokenBalance: "0",
                etherBalance: "0",
                neuBalance: "0",

                etherTokenICBMLockedWallet: {
                  LockedBalance: "0",
                  neumarksDue: "0",
                  unlockDate: "0",
                },
              },
            },
          },
        )
        .returns(emptyWalletData)
        .run();
    });
    it("will populate wallet data, some have funds", async () => {
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
            ...testStateCommon,
            tokenPrice: testTokenPrice,
            wallet: testWallet,
          },
        )
        .returns(walletData)
        .run();
    });
  });
  describe("loadInitialWalletView()", () => {
    it("loadInitialWalletView success", async () => {
      await expectSaga(loadInitialWalletView)
        .withState({
          ...testStateCommon,
          txHistory: {
            transactionsByHash: {
              [ethTransfer.id]: ethTransfer,
              [neuTransfer.id]: neuTransfer,
              [neuroSend.id]: neuroSend,
            },
            transactionsOrder: ["1117_0_256", "132_0_8", "132_0_1"],
            lastTransactionId: "132_0_1",
            timestampOfLastChange: 1225,
            status: EModuleStatus.IDLE,
          },
          txMonitor: {
            txs: {
              pendingTransaction: generalPendingTxFixture(
                "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988",
              ),
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
            userAddress: testEthAddress,
            balanceData: resultBalanceData,
            totalBalanceEuro: convertFromUlps(
              "7.185643883006235950603418691957129192e+22",
            ).toString(),
            bankAccount: testBankAccount,
            processState: EProcessState.SUCCESS,
            transactions: [ethTransfer, neuTransfer, neuroSend],
            canLoadMoreTx: true,
            transactionHistoryLoading: false,
            pendingTransaction: pendingTx,
          }),
        )
        .returns(EProcessState.SUCCESS)
        .run();
    });
    it("loadInitialWalletView failure", async () => {
      await expectSaga(loadInitialWalletView)
        .provide([
          [matchers.getContext("deps"), context],
          [matchers.call.fn(walletApi.sagas.loadWalletDataSaga), throwError(new Error("oi wei"))],
          [matchers.call.fn(kycApi.sagas.loadBankAccountDetails), undefined],
          [matchers.call.fn(populateWalletData), walletData],
        ])
        .not.put(actions.walletView.walletViewSetData({} as any))
        .returns(EProcessState.ERROR)
        .run();
    });
  });
  describe("walletViewController", () => {
    const newState = {
      userIsFullyVerified: true,
      userAddress: testEthAddress,
      balanceData: resultBalanceData,
      totalBalanceEuro: convertFromUlps("7.185643883006235950603418691957129192e+22").toString(),
      bankAccount: testBankAccount,
      processState: EProcessState.SUCCESS,
      transactions: [ethTransfer, neuTransfer, neuroSend],
      canLoadMoreTx: true,
      transactionHistoryLoading: false,
      pendingTransaction: pendingTx,
    } as TWalletViewReadyState & { processState: EProcessState.SUCCESS };

    const txHistoryReturn = {
      transactionsHistoryPaginated: {
        transactions: [ethTransfer, neuTransfer, neuroSend],
        canLoadMore: true,
        isLoading: false,
      },
      pendingTransaction: pendingTx,
    };

    it.only(
      "loads inital view data " +
        "and then loops on receiving specified actions and reloads the view data",
      async () => {
        await expectSaga(walletViewController)
          .withReducer(
            combineReducers({
              tokenPrice: tokenPriceModuleApi.reducer.tokenPrice,
              user: authModuleAPI.reducer.user,
              kyc: kycApi.reducerMap.kyc,
              wallet: walletApi.reducer.wallet,
              web3: web3Reducer,
              walletView: walletViewReducer,
            }),
            {
              ...testStateCommon,
              tokenPrice: testTokenPrice,
              wallet: testWallet,
              walletView: {
                userIsFullyVerified: true,
                userAddress: testEthAddress,
                balanceData: resultBalanceData,
                totalBalanceEuro: convertFromUlps(
                  "7.185643883006235950603418691957129192e+22",
                ).toString(),
                bankAccount: testBankAccount,
                processState: EProcessState.SUCCESS,
                transactions: [ethTransfer, neuTransfer, neuroSend],
                canLoadMoreTx: true,
                transactionHistoryLoading: false,
                pendingTransaction: pendingTx,
              },
            },
          )
          .provide([
            [matchers.call.fn(loadInitialWalletView), EProcessState.SUCCESS],
            {
              take: takeWithCount({
                count: 1,
                actionCreator: actions.txTransactions.upgradeSuccessful,
                actionPayload: {},
              }),
            },
            {
              take: takeWithCount({
                count: 1,
                actionCreator: tokenPriceModuleApi.actions.saveTokenPrice,
                actionPayload: {},
              }),
              call: callWithCount({
                count: 1,
                expectedFunction: populateTxHistory,
                functionReturn: txHistoryReturn,
              }),
            },
            {
              take: takeWithCount({
                count: 1,
                actionCreator: txHistoryApi.actions.setTransactions,
                actionPayload: {},
              }),
              call: callWithCount({
                count: 1,
                expectedFunction: populateTxHistory,
                functionReturn: txHistoryReturn,
              }),
            },
            {
              take: takeWithCount({
                count: 1,
                actionCreator: actions.txMonitor.setPendingTxs,
                actionPayload: {},
              }),
              call: callWithCount({
                count: 1,
                expectedFunction: populateTxHistory,
                functionReturn: txHistoryReturn,
              }),
            },
          ])
          .call(loadInitialWalletView, undefined)
          .put(txHistoryApi.actions.startWatchingForNewTransactions())

          //start looping
          .take(actions.txTransactions.upgradeSuccessful)
          .call(populateBalanceData)
          .put(actions.walletView.walletViewSetData(newState))

          .take(tokenPriceModuleApi.actions.saveTokenPrice)
          .call(populateBalanceData)
          .call(populateTxHistory)
          .put(actions.walletView.walletViewSetData(newState))

          .take(txHistoryApi.actions.setTransactions)
          .call(populateTxHistory)
          .put(actions.walletView.walletViewSetData(newState))

          .take(actions.txMonitor.setPendingTxs)
          .call(populateTxHistory)
          .put(actions.walletView.walletViewSetData(newState))

          .run();
      },
    );
  });
});
