import { provideDelay, provideDelayWithCount } from "@neufund/sagas";
import { expectSaga, matchers, providers } from "@neufund/sagas/tests";
import {
  createActionFactory,
  DeepPartial,
  ECurrency,
  ENumberInputFormat,
  EquityToken,
  EthereumAddressWithChecksum,
} from "@neufund/shared-utils";
import { callGuard, createMock } from "@neufund/shared-utils/tests";

import {
  ETxHistoryMessage,
  notificationUIModuleApi,
  setupAuthModule,
  setupCoreModule,
  setupTxHistoryModule,
  TModuleState,
} from "../..";
import { EUserType } from "../../";
import { createMessage } from "../../messages";
import { bootstrapModule } from "../../tests";
import { BACKEND_BASE_URL } from "../auth/user/sagas.spec";
import { txHistoryActions } from "./actions";
import { TX_REFRESH_DELAY } from "./constants";
import { AnalyticsApi } from "./lib/http/analytics-api/AnalyticsApi";
import { ETransactionDirection, ETransactionType } from "./lib/http/analytics-api/interfaces";
import { EModuleStatus, initialState as txHistoryInitialState } from "./reducer";
import {
  loadTransactionsHistory,
  loadTransactionsHistoryNext,
  mapAnalyticsApiTransactionResponse,
  watchTransactions,
} from "./sagas";
import {
  investementTx,
  neurPurchaseTx,
  processedReceiveEthTx,
  processedReceiveNeuTx,
  processedSendNeuroTx,
  receiveEthTx,
  recevieNeuTx,
  redeemNeurTx,
  refundTx,
  sendNeurTx,
  unlockIcbmTx,
} from "./sagas.specFixtures";
import {
  selectLastTransactionId,
  selectTimestampOfLastChange,
  selectTxHistoryState,
} from "./selectors";
import { symbols } from "./symbols";
import { ETransactionStatus, ETransactionSubType } from "./types";
import { convertTxHistory, convertTxHistoryNext, mergeTxHistory } from "./utils";

const setupContextForTests = async () => {
  const { expectSaga: enhancedExpectSaga, container } = bootstrapModule([
    setupCoreModule({ backendRootUrl: BACKEND_BASE_URL }),
    setupTxHistoryModule({ refreshOnAction: undefined }),
  ]);

  const analyticsApi = createMock(AnalyticsApi, {
    getUpdatedTransactions: callGuard("getUpdatedTransactions"),
    getTransactionsList: callGuard("getTransactionsList"),
  });

  container.rebind(symbols.analyticsApi).toConstantValue(analyticsApi);

  return { enhancedExpectSaga, analyticsApi };
};

describe.skip("Tx History sagas", () => {
  describe("mapAnalyticsApiTransactionResponse", () => {
    describe("should correctly process ETO_INVESTMENT", () => {
      it("default", async () => {
        const initialState: TModuleState<typeof setupTxHistoryModule> &
          DeepPartial<TModuleState<typeof setupAuthModule>> = {
          txHistory: txHistoryInitialState,
          user: {
            data: {
              type: EUserType.INVESTOR,
              userId: "0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum,
            },
          },
        };

        await expectSaga(mapAnalyticsApiTransactionResponse, {}, investementTx)
          .withState(initialState)
          .returns({
            amount: "132465754321456760000",
            amountFormat: ENumberInputFormat.ULPS,
            blockNumber: 123456,
            date: "2019-08-07T06:58:48.736923+00:00",
            id: "123456_34567_2",
            logIndex: 2,
            transactionDirection: ETransactionDirection.IN,
            transactionIndex: 34567,
            txHash: "0xea3145cf6334a8fe5a9570c05fef7ebb2b3c728369fccae5cf8f30809d99be94",
            neuReward: "123",
            neuRewardEur: "15.90100348672348146",
            isICBMInvestment: true,
            amountEur: "123123123",
            companyName: "BlaBlaCompany GmbH",
            currency: ECurrency.ETH,
            equityTokenAmount: "123",
            equityTokenAmountFormat: ENumberInputFormat.ULPS,
            equityTokenCurrency: "ETH",
            equityTokenIcon: "asdf.png",
            etoId: "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8989",
            toAddress: "0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883",
            fromAddress: "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8989",
            subType: ETransactionStatus.COMPLETED,
            type: ETransactionType.ETO_INVESTMENT,
          })
          .run();
      });
      it("throws if no assetTokenMetadata or tokenMetadata", async () => {
        const initialState: TModuleState<typeof setupTxHistoryModule> &
          DeepPartial<TModuleState<typeof setupAuthModule>> = {
          txHistory: txHistoryInitialState,
          user: {
            data: {
              type: EUserType.INVESTOR,
              userId: "0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum,
            },
          },
        };

        const invalidIinvestementTx = {
          ...investementTx,
          extraData: {
            ...investementTx.extraData,
            assetTokenMetadata: undefined,
            tokenMetadata: undefined,
          },
        };

        await expectSaga(mapAnalyticsApiTransactionResponse, {}, invalidIinvestementTx)
          .withState(initialState)
          .throws(new Error("Invalid asset token metadata"))
          .run();
      });
    });
    describe("should correctly process ETO_REFUND", () => {
      it("default", async () => {
        const initialState: TModuleState<typeof setupTxHistoryModule> &
          DeepPartial<TModuleState<typeof setupAuthModule>> = {
          txHistory: txHistoryInitialState,
          user: {
            data: {
              type: EUserType.INVESTOR,
              userId: "0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum,
            },
          },
        };

        await expectSaga(mapAnalyticsApiTransactionResponse, {}, refundTx)
          .withState(initialState)
          .returns({
            amount: "132465754321456760000",
            amountFormat: ENumberInputFormat.ULPS,
            blockNumber: 123456,
            date: "2019-08-07T06:58:48.736923+00:00",
            id: "123456_34567_2",
            logIndex: 2,
            transactionDirection: ETransactionDirection.IN,
            transactionIndex: 34567,
            txHash: "0xea3145cf6334a8fe5a9570c05fef7ebb2b3c728369fccae5cf8f30809d99be94",
            currency: ECurrency.ETH,
            amountEur: "2.57977589211408236905557337636392e+22",
            toAddress: "0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883",
            subType: undefined,
            etoId: "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8989",
            type: ETransactionType.ETO_REFUND,
            companyName: "BlaBlaCompany GmbH",
          })
          .run();
      });
      it("throws if no assetTokenMetadata or tokenMetadata", async () => {
        const initialState: TModuleState<typeof setupTxHistoryModule> &
          DeepPartial<TModuleState<typeof setupAuthModule>> = {
          txHistory: txHistoryInitialState,
          user: {
            data: {
              type: EUserType.INVESTOR,
              userId: "0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum,
            },
          },
        };

        const invalidRefundTx = {
          ...refundTx,
          extraData: {
            ...investementTx.extraData,
            assetTokenMetadata: undefined,
            tokenMetadata: undefined,
          },
        };

        await expectSaga(mapAnalyticsApiTransactionResponse, {}, invalidRefundTx)
          .withState(initialState)
          .throws(new Error("Invalid asset token metadata"))
          .run();
      });
    });
    describe("should correctly process TRANSFER", () => {
      it("default", async () => {
        await expectSaga(mapAnalyticsApiTransactionResponse, {}, sendNeurTx)
          .returns(processedSendNeuroTx)
          .run();
      });
      it("equityTokenInterface", async () => {
        const etSendNeurTx = {
          ...sendNeurTx,
          extraData: {
            ...sendNeurTx.extraData,
            tokenInterface: "equityTokenInterface",
            tokenMetadata: {
              ...sendNeurTx.extraData.tokenMetadata,
              tokenDecimals: 18,
              tokenSymbol: "ETH" as EquityToken,
              tokenCommitmentAddress: "0xfA1Af2E251ee739F83e14d7daCfd77B3d0E930b7" as EthereumAddressWithChecksum,
              tokenImage: "asdfa.svg",
            },
          },
        };

        const expected = {
          ...processedSendNeuroTx,
          type: ETransactionType.TRANSFER,
          subType: ETransactionSubType.TRANSFER_EQUITY_TOKEN,
          currency: "ETH",
          etoId: "0xfA1Af2E251ee739F83e14d7daCfd77B3d0E930b7",
          icon: "asdfa.svg",
        };
        delete expected.amountEur;

        await expectSaga(mapAnalyticsApiTransactionResponse, {}, etSendNeurTx)
          .returns(expected)
          .run();
      });
    });
    describe("should correctly process NEUR_PURCHASE", () => {
      it("default", async () => {
        await expectSaga(mapAnalyticsApiTransactionResponse, {}, neurPurchaseTx)
          .returns({
            amount: "132465754321456760000",
            amountFormat: ENumberInputFormat.ULPS,
            blockNumber: 123456,
            date: "2019-08-07T06:58:48.736923+00:00",
            id: "123456_34567_2",
            logIndex: 2,
            transactionDirection: ETransactionDirection.IN,
            transactionIndex: 34567,
            txHash: "0xea3145cf6334a8fe5a9570c05fef7ebb2b3c728369fccae5cf8f30809d99be94",
            subType: undefined,
            type: ETransactionType.NEUR_PURCHASE,
            currency: ECurrency.EUR_TOKEN,
            toAddress: "0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883",
          })
          .run();
      });
    });
    describe("should correctly process NEUR_REDEEM", () => {
      it("settled", async () => {
        await expectSaga(mapAnalyticsApiTransactionResponse, {}, redeemNeurTx)
          .returns({
            amount: "29083350986799034000",
            amountFormat: ENumberInputFormat.ULPS,
            blockNumber: 8,
            date: "2019-08-07T06:58:48.736923+00:00",
            id: "8_0_0",
            logIndex: 0,
            transactionDirection: ETransactionDirection.OUT,
            transactionIndex: 0,
            txHash: "0xea3145cf6334a8fe5a9570c05fef7ebb2b3c728369fccae5cf8f30809d99be94",
            settledAmount: "29083350986799030000",
            subType: ETransactionStatus.COMPLETED,
            type: ETransactionType.NEUR_REDEEM,
            currency: ECurrency.EUR_TOKEN,
            reference: "XNKAPOMXNOAS",
            fromAddress: "0xfA1Af2E251ee739F83e14d7daCfd77B3d0E930b7",
            feeAmount: "4000",
          })
          .run();
      });
      it("pending", async () => {
        const pendingTx = {
          ...redeemNeurTx,
          extraData: {
            ...redeemNeurTx.extraData,
            settledAmount: undefined,
          },
        };
        await expectSaga(mapAnalyticsApiTransactionResponse, {}, pendingTx)
          .returns({
            amount: "29083350986799034000",
            amountFormat: ENumberInputFormat.ULPS,
            blockNumber: 8,
            date: "2019-08-07T06:58:48.736923+00:00",
            id: "8_0_0",
            logIndex: 0,
            transactionDirection: ETransactionDirection.OUT,
            transactionIndex: 0,
            txHash: "0xea3145cf6334a8fe5a9570c05fef7ebb2b3c728369fccae5cf8f30809d99be94",
            subType: ETransactionStatus.PENDING,
            type: ETransactionType.NEUR_REDEEM,
            currency: ECurrency.EUR_TOKEN,
            reference: "XNKAPOMXNOAS",
            fromAddress: "0xfA1Af2E251ee739F83e14d7daCfd77B3d0E930b7",
          })
          .run();
      });
    });
  });
  describe("loadTransactionsHistory", async () => {
    const initialState: TModuleState<typeof setupTxHistoryModule> = {
      txHistory: txHistoryInitialState,
    };

    it("loads and saves new transactions if last tx timestamps are different", async () => {
      const { enhancedExpectSaga, analyticsApi } = await setupContextForTests();

      const processedTransactions = [
        processedReceiveEthTx,
        processedReceiveNeuTx,
        processedSendNeuroTx,
      ];

      const txHistoryFinalState = {
        transactionsByHash: {
          "1117_0_256": processedReceiveEthTx,
          "132_0_8": processedReceiveNeuTx,
          "132_0_1": processedSendNeuroTx,
        },
        transactionsOrder: ["1117_0_256", "132_0_8", "132_0_1"],
        lastTransactionId: undefined,
        timestampOfLastChange: 1225,
        status: EModuleStatus.IDLE,
      };

      await enhancedExpectSaga(loadTransactionsHistory)
        .withState(initialState)
        .provide([
          [
            matchers.call.fn(analyticsApi.getTransactionsList),
            {
              transactions: [receiveEthTx, unlockIcbmTx, recevieNeuTx, sendNeurTx],
              beforeTransaction: undefined,
              version: 1225,
            },
          ],
          [matchers.select(selectTimestampOfLastChange), 1111],
        ])
        .put(
          txHistoryActions.setTransactions(
            convertTxHistory(processedTransactions, undefined, 1225),
          ),
        )
        .hasFinalState({
          ...initialState,
          txHistory: txHistoryFinalState,
        })
        .run(false);
    });

    it("doesn't save new transactions if last tx timestamps are the same", async () => {
      const { enhancedExpectSaga, analyticsApi } = await setupContextForTests();

      await enhancedExpectSaga(loadTransactionsHistory)
        .withState({
          ...initialState,
          txHistory: {
            ...txHistoryInitialState,
            timestampOfLastChange: 1225,
          },
        })
        .provide([
          [
            matchers.call.fn(analyticsApi.getTransactionsList),
            {
              transactions: [receiveEthTx, unlockIcbmTx, recevieNeuTx, sendNeurTx],
              beforeTransaction: undefined,
              version: 1225,
            },
          ],
        ])
        .run(false);
    });
    it("shows a notification in case of error while loading new txs", async () => {
      const { enhancedExpectSaga, analyticsApi } = await setupContextForTests();

      await enhancedExpectSaga(loadTransactionsHistory)
        .withState(initialState)
        .provide([
          [
            matchers.call.fn(analyticsApi.getTransactionsList),
            providers.throwError(new Error("oy vey")),
          ],
        ])
        .put(
          notificationUIModuleApi.actions.showError(
            createMessage(ETxHistoryMessage.TX_HISTORY_FAILED_TO_LOAD),
          ),
        )
        .put(txHistoryActions.setTransactions(txHistoryInitialState))
        .hasFinalState(initialState)
        .run();
    });
  });
  describe("loadTransactionsHistoryNext", async () => {
    const lastTxId = "132_0_8";
    const newLastTxId = "132_0_1";

    const txHistoryInitialStateWithTransactions = {
      transactionsByHash: {
        "1117_0_256": processedReceiveEthTx,
        [lastTxId]: processedReceiveNeuTx,
      },
      transactionsOrder: ["1117_0_256", lastTxId],
      lastTransactionId: undefined,
      timestampOfLastChange: 1225,
      status: EModuleStatus.IDLE,
    };

    const initialState = {
      txHistory: txHistoryInitialStateWithTransactions,
    };

    it("saves new transactions to the state", async () => {
      const { enhancedExpectSaga, analyticsApi } = await setupContextForTests();

      const processedTransactions = [processedSendNeuroTx];

      const txHistoryFinalState = {
        transactionsByHash: {
          "1117_0_256": processedReceiveEthTx,
          [lastTxId]: processedReceiveNeuTx,
          [newLastTxId]: processedSendNeuroTx,
        },
        transactionsOrder: ["1117_0_256", lastTxId, newLastTxId],
        lastTransactionId: newLastTxId,
        timestampOfLastChange: 1225,
        status: EModuleStatus.IDLE,
      };

      const expectedPut = convertTxHistoryNext(
        processedTransactions,
        txHistoryInitialStateWithTransactions,
        newLastTxId,
      );

      await enhancedExpectSaga(loadTransactionsHistoryNext)
        .withState(initialState)
        .provide([
          [
            matchers.call.fn(analyticsApi.getTransactionsList),
            {
              transactions: [sendNeurTx],
              beforeTransaction: newLastTxId,
              version: 1225,
            },
          ],
        ])
        .put(txHistoryActions.setTransactions(expectedPut))
        .hasFinalState({
          ...initialState,
          txHistory: txHistoryFinalState,
        })
        .run(false);
    });
    it("shows a notification module on error", async () => {
      const { enhancedExpectSaga, analyticsApi } = await setupContextForTests();

      await enhancedExpectSaga(loadTransactionsHistoryNext)
        .withState(initialState)
        .provide([
          [matchers.select(selectLastTransactionId), lastTxId],
          [
            matchers.call.fn(analyticsApi.getTransactionsList),
            providers.throwError(new Error("oy vey")),
          ],
        ])
        .put(
          notificationUIModuleApi.actions.showError(
            createMessage(ETxHistoryMessage.TX_HISTORY_FAILED_TO_LOAD_NEXT),
          ),
        )
        .hasFinalState(initialState)
        .run(false);
    });
  });
  describe("watchTransactions", async () => {
    const lastTxId = "132_0_8";
    const newLastTxId = "132_0_1";
    const timestampOfLastChange = 1225;
    const newTimestampOfLastChange = 2225;

    const txHistoryInitialStateWithTransactions = {
      transactionsByHash: {
        "1117_0_256": processedReceiveEthTx,
        [lastTxId]: processedReceiveNeuTx,
      },
      transactionsOrder: ["1117_0_256", lastTxId],
      lastTransactionId: undefined,
      timestampOfLastChange,
      status: EModuleStatus.IDLE,
    };

    const initialState = {
      txHistory: txHistoryInitialStateWithTransactions,
    };
    it("awaits for an action to refresh", async () => {
      const { enhancedExpectSaga } = await setupContextForTests();

      const expectedRefreshAction = createActionFactory("TEST_ACTION");

      await enhancedExpectSaga(watchTransactions, {}, expectedRefreshAction)
        .provide([[matchers.take(expectedRefreshAction), {}]])
        .take(expectedRefreshAction)
        .select(selectTxHistoryState)
        .run();
    });
    it("refreshes on delay if no refresh action specified", async () => {
      const { enhancedExpectSaga } = await setupContextForTests();

      await enhancedExpectSaga(watchTransactions, {}, undefined)
        .provide([provideDelay()])
        .delay(TX_REFRESH_DELAY)
        .select(selectTxHistoryState)
        .run();
    });
    it("loads updated transactions and merges them into txHistory state", async () => {
      const { enhancedExpectSaga, analyticsApi } = await setupContextForTests();

      const processedTransactions = [processedSendNeuroTx];

      const txHistoryFinalState = {
        transactionsByHash: {
          "1117_0_256": processedReceiveEthTx,
          [lastTxId]: processedReceiveNeuTx,
          [newLastTxId]: processedSendNeuroTx,
        },
        transactionsOrder: ["1117_0_256", lastTxId, newLastTxId],
        lastTransactionId: newLastTxId,
        timestampOfLastChange: newTimestampOfLastChange,
        status: EModuleStatus.IDLE,
      };

      const expectedPut = mergeTxHistory(
        txHistoryInitialStateWithTransactions,
        newLastTxId,
        newTimestampOfLastChange,
        processedTransactions,
      );

      await enhancedExpectSaga(watchTransactions, {}, undefined)
        .withState(initialState)
        .provide([
          provideDelayWithCount({ count: 2 }),
          [
            matchers.call.fn(analyticsApi.getUpdatedTransactions),
            {
              transactions: [sendNeurTx],
              beforeTransaction: newLastTxId,
              version: newTimestampOfLastChange,
            },
          ],
        ])
        .put(txHistoryActions.setTransactions(expectedPut))
        .put(txHistoryActions.setModuleStatus(EModuleStatus.IDLE))
        .hasFinalState({
          ...initialState,
          txHistory: txHistoryFinalState,
        })
        .run();
    });
    it("queries for updated transactions and continues looping if there is nothing new", async () => {
      const { enhancedExpectSaga, analyticsApi } = await setupContextForTests();

      await enhancedExpectSaga(watchTransactions, {}, undefined)
        .withState(initialState)
        .provide([
          provideDelayWithCount({ count: 2 }),
          [
            matchers.call(analyticsApi.getUpdatedTransactions, timestampOfLastChange),
            {
              transactions: [],
              beforeTransaction: newLastTxId,
              version: newTimestampOfLastChange,
            },
          ],
        ])
        .hasFinalState(initialState)
        .call.like({ fn: analyticsApi.getUpdatedTransactions })
        // second loop call
        .call.like({ fn: analyticsApi.getUpdatedTransactions })
        .run();
    });
    it("queries for updated transactions and continues looping if the new timestamp is earlier then the old one", async () => {
      const { enhancedExpectSaga, analyticsApi } = await setupContextForTests();

      await enhancedExpectSaga(watchTransactions, {}, undefined)
        .withState(initialState)
        .provide([
          provideDelayWithCount({ count: 2 }),
          [
            matchers.call.fn(analyticsApi.getUpdatedTransactions),
            {
              transactions: [],
              beforeTransaction: newLastTxId,
              version: 1111,
            },
          ],
        ])
        .hasFinalState(initialState)
        .call.like({ fn: analyticsApi.getUpdatedTransactions })
        // second loop call
        .call.like({ fn: analyticsApi.getUpdatedTransactions })
        .run();
    });
    it("exits if timestampOfLastChange is undefined", async () => {
      const { enhancedExpectSaga, analyticsApi } = await setupContextForTests();

      const invalidTxHistoryInitialState = {
        ...txHistoryInitialStateWithTransactions,
        timestampOfLastChange: undefined,
      };

      await enhancedExpectSaga(watchTransactions, {}, undefined)
        .withState({ ...initialState, txHistory: invalidTxHistoryInitialState })
        .provide([provideDelay()])
        .not.call(analyticsApi.getUpdatedTransactions)
        .returns(undefined)
        .run();
    });
    it("continues looping if there was an error", async () => {
      const { enhancedExpectSaga, analyticsApi } = await setupContextForTests();

      await enhancedExpectSaga(watchTransactions, {}, undefined)
        .withState(initialState)
        .provide([
          provideDelay(),
          [
            matchers.call.fn(analyticsApi.getUpdatedTransactions),
            providers.throwError(new Error("oy wey")),
          ],
        ])
        .call.like({ fn: analyticsApi.getUpdatedTransactions })
        // second loop call
        .call.like({ fn: analyticsApi.getUpdatedTransactions })
        .run();
    });
  });
});
