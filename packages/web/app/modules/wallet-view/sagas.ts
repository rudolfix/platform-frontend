import { all, call, fork, put, race, SagaGenerator, select, take } from "@neufund/sagas";
import {
  kycApi,
  tokenPriceModuleApi,
  TTxHistory,
  txHistoryApi,
  walletApi,
} from "@neufund/shared-modules";
import { addBigNumbers, compareBigNumbers, convertFromUlps } from "@neufund/shared-utils";
import { isEqual } from "lodash/fp";

import { TxPendingWithMetadata } from "../../lib/api/users-tx/interfaces";
import { EProcessState } from "../../utils/enums/processStates";
import { processStateIsSuccess } from "../../utils/typeGuards";
import { actions } from "../actions";
import { selectIsUserFullyVerified } from "../auth/selectors";
import { neuCall, neuTakeUntil } from "../sagasUtils";
import { selectPlatformMiningTransaction } from "../tx/monitor/selectors";
import { selectNEURStatus } from "../wallet/selectors";
import { ENEURWalletStatus } from "../wallet/types";
import { selectEthereumAddress } from "../web3/selectors";
import { selectWalletViewData } from "./selectors";
import {
  EBalanceViewType,
  EWalletViewError,
  TBalanceData,
  TBasicBalanceData,
  TWalletViewReadyState,
} from "./types";
import { hasFunds, isMainBalance } from "./utils";

export function* populateWalletData(): Generator<any, TBasicBalanceData[], any> {
  const ethWalletData = yield all({
    amount: select(walletApi.selectors.selectLiquidEtherBalance),
    euroEquivalentAmount: yield* select(walletApi.selectors.selectLiquidEtherBalanceEuroAmount),
  });
  const neuroWalletData = yield all({
    amount: select(walletApi.selectors.selectLiquidEuroTokenBalance),
    euroEquivalentAmount: select(walletApi.selectors.selectLiquidEuroTokenBalance),
    neurStatus: select(selectNEURStatus),
  });
  const icbmEthWalletData = yield all({
    amount: select(walletApi.selectors.selectLockedEtherBalance),
    euroEquivalentAmount: select(walletApi.selectors.selectLockedEtherBalanceEuroAmount),
  });
  const icbmNeuroWalletData = yield all({
    amount: select(walletApi.selectors.selectLockedEuroTokenBalance),
    euroEquivalentAmount: select(walletApi.selectors.selectLockedEuroTokenBalance),
  });
  const lockedIcbmEthWalletData = yield all({
    amount: select(walletApi.selectors.selectICBMLockedEtherBalance),
    euroEquivalentAmount: select(walletApi.selectors.selectICBMLockedEtherBalanceEuroAmount),
    isEtherUpgradeTargetSet: select(walletApi.selectors.selectIsEtherUpgradeTargetSet),
  });
  const lockedIcbmNeuroWalletData = yield all({
    amount: select(walletApi.selectors.selectICBMLockedEuroTokenBalance),
    euroEquivalentAmount: select(walletApi.selectors.selectICBMLockedEuroTokenBalance),
    isEuroUpgradeTargetSet: select(walletApi.selectors.selectIsEuroUpgradeTargetSet),
  });

  return [
    {
      name: EBalanceViewType.ETH,
      hasFunds: compareBigNumbers(ethWalletData.amount, "0") > 0,
      amount: ethWalletData.amount,
      euroEquivalentAmount: ethWalletData.euroEquivalentAmount,
    },
    {
      name:
        neuroWalletData.neurStatus === ENEURWalletStatus.DISABLED_RESTRICTED_US_STATE
          ? EBalanceViewType.RESTRICTED_NEUR
          : EBalanceViewType.NEUR,
      hasFunds: compareBigNumbers(neuroWalletData.amount, "0") > 0,
      amount: neuroWalletData.amount,
      euroEquivalentAmount: neuroWalletData.euroEquivalentAmount,
    },
    {
      name: EBalanceViewType.ICBM_ETH,
      hasFunds: compareBigNumbers(icbmEthWalletData.amount, "0") > 0,
      amount: icbmEthWalletData.amount,
      euroEquivalentAmount: icbmEthWalletData.euroEquivalentAmount,
    },
    {
      name: EBalanceViewType.ICBM_NEUR,
      hasFunds: compareBigNumbers(icbmNeuroWalletData.amount, "0") > 0,
      amount: icbmNeuroWalletData.amount,
      euroEquivalentAmount: icbmNeuroWalletData.euroEquivalentAmount,
    },
    {
      name: EBalanceViewType.LOCKED_ICBM_ETH,
      hasFunds: compareBigNumbers(lockedIcbmEthWalletData.amount, "0") > 0,
      amount: lockedIcbmEthWalletData.amount,
      euroEquivalentAmount: lockedIcbmEthWalletData.euroEquivalentAmount,
    },
    {
      name: EBalanceViewType.LOCKED_ICBM_NEUR,
      hasFunds: compareBigNumbers(lockedIcbmNeuroWalletData.amount, "0") > 0,
      amount: lockedIcbmNeuroWalletData.amount,
      euroEquivalentAmount: lockedIcbmNeuroWalletData.euroEquivalentAmount,
    },
  ].map(item => ({
    ...item,
    euroEquivalentAmount: item.hasFunds
      ? convertFromUlps(item.euroEquivalentAmount).toString()
      : item.euroEquivalentAmount,
  }));
}

export function* populateBalanceData(): SagaGenerator<{
  balanceData: TBasicBalanceData[];
  totalBalanceEuro: string;
}> {
  const balanceData = (yield* call(populateWalletData)).filter(
    (balance: TBasicBalanceData) => isMainBalance(balance) || hasFunds(balance),
  );

  const totalBalanceEuro = addBigNumbers(
    balanceData.map((balance: TBalanceData) => balance.euroEquivalentAmount),
  );

  return { balanceData, totalBalanceEuro };
}

export function* populateTxHistory(): SagaGenerator<{
  transactions: TTxHistory[];
  canLoadMoreTx: boolean;
  transactionHistoryLoading: boolean;
  pendingTransaction: TxPendingWithMetadata | null;
}> {
  const transactionsHistoryPaginated = yield* select(
    txHistoryApi.selectors.selectTxHistoryPaginated,
  );
  const pendingTransaction = yield* select(selectPlatformMiningTransaction);

  let transactions: TTxHistory[] = [];
  let canLoadMoreTx = false;
  let transactionHistoryLoading = false;

  if (
    transactionsHistoryPaginated !== undefined &&
    transactionsHistoryPaginated.transactions !== undefined
  ) {
    transactions = transactionsHistoryPaginated.transactions;
    canLoadMoreTx = transactionsHistoryPaginated.canLoadMore;
    transactionHistoryLoading = transactionsHistoryPaginated.isLoading;
  }

  return { transactions, canLoadMoreTx, transactionHistoryLoading, pendingTransaction };
}

export function* loadInitialWalletView(): Generator<any, EProcessState, any> {
  try {
    yield all([
      neuCall(walletApi.sagas.loadWalletDataSaga),
      neuCall(kycApi.sagas.loadBankAccountDetails),
      put(txHistoryApi.actions.loadTransactions()),
    ]);

    const userIsFullyVerified = yield* select(selectIsUserFullyVerified);
    const userAddress = yield* select(selectEthereumAddress);
    const bankAccount = yield* select(kycApi.selectors.selectBankAccount);

    const { balanceData, totalBalanceEuro } = yield* call(populateBalanceData);
    const {
      transactions,
      canLoadMoreTx,
      transactionHistoryLoading,
      pendingTransaction,
    } = yield* call(populateTxHistory);

    yield put(
      actions.walletView.walletViewSetData({
        userIsFullyVerified,
        userAddress,
        balanceData,
        totalBalanceEuro,
        bankAccount,
        transactions,
        canLoadMoreTx,
        pendingTransaction,
        transactionHistoryLoading,
        processState: EProcessState.SUCCESS,
      }),
    );
    return EProcessState.SUCCESS;
  } catch (e) {
    yield put(
      actions.walletView.walletViewSetData({
        processState: EProcessState.ERROR,
        errorType: EWalletViewError.GENERIC_ERROR,
      }),
    );
    return EProcessState.ERROR;
  }
}

export function* walletViewController(): Generator<any, void, any> {
  try {
    yield neuCall(loadInitialWalletView);

    const oldState = yield* select(selectWalletViewData);

    if (processStateIsSuccess<TWalletViewReadyState>(oldState)) {
      yield put(txHistoryApi.actions.startWatchingForNewTransactions());

      while (true) {
        const dataReloadRequired = yield race({
          icbmUpgrade: take(actions.txTransactions.upgradeSuccessful),
          tokenPriceData: take(tokenPriceModuleApi.actions.saveTokenPrice),
          txHistoryDataRequest: take(actions.walletView.loadNextTransactions),
          txHistoryData: take(txHistoryApi.actions.setTransactions),
          pendingTxChange: take(actions.txMonitor.setPendingTxs),
        });

        let newState;

        if (dataReloadRequired.icbmUpgrade) {
          const { balanceData, totalBalanceEuro } = yield* call(populateBalanceData);
          newState = {
            ...oldState,
            balanceData,
            totalBalanceEuro,
          };
        } else if (dataReloadRequired.tokenPriceData) {
          const { balanceData, totalBalanceEuro } = yield* call(populateBalanceData);
          const { transactions, canLoadMoreTx, pendingTransaction } = yield* call(
            populateTxHistory,
          );

          newState = {
            ...oldState,
            balanceData,
            totalBalanceEuro,
            transactions,
            canLoadMoreTx,
            pendingTransaction,
          };
        } else if (dataReloadRequired.txHistoryDataRequest) {
          yield put(txHistoryApi.actions.loadNextTransactions());

          newState = {
            ...oldState,
            transactionHistoryLoading: true,
          };
        } else if (dataReloadRequired.txHistoryData) {
          const { transactions, canLoadMoreTx, pendingTransaction } = yield* call(
            populateTxHistory,
          );

          newState = {
            ...oldState,
            transactions,
            canLoadMoreTx,
            pendingTransaction,
            transactionHistoryLoading: false,
          };
        } else if (dataReloadRequired.pendingTxChange) {
          const { transactions, canLoadMoreTx, pendingTransaction } = yield* call(
            populateTxHistory,
          );

          newState = {
            ...oldState,
            transactions,
            canLoadMoreTx,
            pendingTransaction,
          };
        } else {
          continue;
        }

        // some modules (pendingTx) keep updating the state even if there was no change.
        // This is to prevent unnecessary renders
        if (!isEqual(oldState, newState)) {
          yield put(actions.walletView.walletViewSetData(newState));
        }
      }
    }
  } finally {
    yield put(txHistoryApi.actions.stopWatchingForNewTransactions());
  }
}

export function* walletViewSagas(): Generator<any, void, any> {
  yield fork(
    neuTakeUntil,
    actions.walletView.loadWalletView,
    "@@router/LOCATION_CHANGE",
    walletViewController,
  );
}
