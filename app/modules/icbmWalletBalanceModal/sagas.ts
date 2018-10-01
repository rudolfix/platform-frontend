import { BigNumber } from "bignumber.js";
import { delay } from "bluebird";
import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { actions } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";
import { neuTakeUntil } from "../sagasUtils";
import { ILockedWallet, IWalletStateData } from "../wallet/reducer";
import { loadWalletDataAsync } from "../wallet/sagas";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { TAction } from "./../actions";
import { IWalletMigrationData } from "./reducer";
import { selectIcbmWalletEthAddress } from "./selectors";

class IcbmWalletError extends Error {}

class NoIcbmWalletError extends IcbmWalletError {}
class SameUserError extends IcbmWalletError {}

function hasIcbmWallet(lockedWallet: ILockedWallet): boolean {
  return lockedWallet.unlockDate !== "0";
}

function* loadIcbmWalletMigrationTransactionSaga({
  logger,
  notificationCenter,
  contractsService,
}: TGlobalDependencies): any {
  try {
    const currentEthAddress: string = yield select((s: IAppState) =>
      selectEthereumAddressWithChecksum(s.web3),
    );
    const icbmEthAddress: string = yield select((s: IAppState) =>
      selectIcbmWalletEthAddress(s.icbmWalletBalanceModal),
    );
    const investorMigrationWallet: [
      string[],
      BigNumber[]
    ] = yield contractsService.etherLock.getInvestorMigrationWallets(icbmEthAddress);

    const didUserConductFirstTransaction = !!(
      investorMigrationWallet[0][0].toLowerCase() === currentEthAddress.toLowerCase() &&
      investorMigrationWallet[0].length === 1
    );
    const etherLockAddress = yield contractsService.etherLock.address;
    const icbmEtherLockAddress = yield contractsService.icbmEtherLock.address;

    const walletMigrationData: IWalletMigrationData = didUserConductFirstTransaction
      ? // If a user added more than one address then we consider him to be a power user
        {
          migrationInputData: contractsService.icbmEtherLock.migrateTx().getData(),
          migrationStep: 2,
          smartContractAddress: icbmEtherLockAddress,
          gasLimit: "400000",
          value: "0",
        }
      : {
          migrationInputData: contractsService.etherLock
            .setInvestorMigrationWalletTx(currentEthAddress)
            .getData(),
          migrationStep: 1,
          smartContractAddress: etherLockAddress,
          gasLimit: "200000",
          value: "0",
        };

    yield put(actions.icbmWalletBalanceModal.loadIcbmMigrationData(walletMigrationData));
  } catch (e) {
    logger.error("Error: ", e);
    return notificationCenter.error("Error while running migration tool");
  }
}

function* loadIcbmWalletMigrationSaga(
  { logger, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  const ethAddress = yield select((s: IAppState) =>
    selectIcbmWalletEthAddress(s.icbmWalletBalanceModal),
  );
  if (action.type !== "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA") return;
  try {
    const userAddress = yield select((s: IAppState) => selectEthereumAddressWithChecksum(s.web3));
    if (userAddress === ethAddress) throw new SameUserError();

    const migrationWalletData: IWalletStateData = yield neuCall(loadWalletDataAsync, ethAddress);
    const isIcbmUser = hasIcbmWallet(migrationWalletData.etherTokenICBMLockedWallet);
    if (!isIcbmUser) throw new NoIcbmWalletError();

    yield put(actions.icbmWalletBalanceModal.showIcbmWalletBalanceModal());
    yield put(
      actions.icbmWalletBalanceModal.loadIcbmWalletData(
        migrationWalletData.etherTokenICBMLockedWallet,
      ),
    );
    yield neuCall(loadIcbmWalletMigrationTransactionSaga);
  } catch (e) {
    logger.error("Error: ", e);
    // todo: all texts to text resources
    if (e instanceof NoIcbmWalletError)
      return notificationCenter.error("ICBM Wallet not found for given Ethereum address");
    if (e instanceof SameUserError) return notificationCenter.error("This is your current address");
    // Default Error
    return notificationCenter.error("Error while loading wallet data");
  }
}

function* icbmWalletMigrationTransactionWatcher({ contractsService }: TGlobalDependencies): any {
  const currentEthAddress = yield select((s: IAppState) =>
    selectEthereumAddressWithChecksum(s.web3),
  );
  const icbmEthAddress = yield select((s: IAppState) =>
    selectIcbmWalletEthAddress(s.icbmWalletBalanceModal),
  );
  if (currentEthAddress === icbmEthAddress) return;

  while (true) {
    const investorMigrationWallet: [
      string[],
      BigNumber[]
    ] = yield contractsService.etherLock.getInvestorMigrationWallets(icbmEthAddress);
    const didUserConductFirstTransaction = !!(
      investorMigrationWallet[0][0] === currentEthAddress && investorMigrationWallet[0].length === 1
    );
    if (didUserConductFirstTransaction) {
      yield put(actions.icbmWalletBalanceModal.getWalletData(icbmEthAddress));
      return;
    }
    yield delay(3000);
  }
}

export function* icbmWalletGetDataSagas(): any {
  yield fork(
    neuTakeEvery,
    "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA",
    loadIcbmWalletMigrationSaga,
  );
  yield neuTakeUntil(
    "ICBM_WALLET_BALANCE_MODAL_SHOW",
    "ICBM_WALLET_BALANCE_MODAL_HIDE",
    icbmWalletMigrationTransactionWatcher,
  );
}
