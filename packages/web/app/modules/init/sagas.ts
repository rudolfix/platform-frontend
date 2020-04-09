import { call, fork, put, select } from "@neufund/sagas";
import { isJwtExpiringLateEnough } from "@neufund/shared";
import { authModuleAPI } from "@neufund/shared-modules";

import { TGlobalDependencies } from "../../di/setupBindings";
import { TStoredWalletConnectData } from "../../lib/persistence/WalletConnectStorage";
import { TAppGlobalState } from "../../store";
import { actions, TActionFromCreator } from "../actions";
import { ELogoutReason } from "../auth/types";
import { loadUser } from "../auth/user/external/sagas";
import { handleLogOutUserInternal } from "../auth/user/sagas";
import { initializeContracts, populatePlatformTermsConstants } from "../contracts/sagas";
import { neuCall, neuTakeEvery, neuTakeOnly } from "../sagasUtils";
import { detectUserAgent } from "../user-agent/sagas";
import { walletConnectInit } from "../wallet-selector/wallet-connect/sagas";
import { initWeb3ManagerEvents } from "../web3/sagas";
import { selectWalletType } from "../web3/selectors";
import { EWalletType } from "../web3/types";
import { WalletMetadataNotFoundError } from "./errors";
import { EInitType } from "./reducer";
import { selectIsAppReady, selectIsSmartContractInitDone } from "./selectors";

function* initSmartcontracts({
  web3Manager,
  logger,
}: TGlobalDependencies): Generator<any, void, any> {
  try {
    yield fork(neuCall, initWeb3ManagerEvents);
    yield web3Manager.initialize();

    yield neuCall(initializeContracts);
    yield neuCall(populatePlatformTermsConstants);

    yield put(actions.init.done(EInitType.SMART_CONTRACTS_INIT));
  } catch (e) {
    yield put(
      actions.init.error(
        EInitType.SMART_CONTRACTS_INIT,
        "Error while connecting with Ethereum blockchain",
      ),
    );
    logger.error("Smart Contract Init Error", e);
  }
}

function* makeSureWalletMetaDataExists({
  walletStorage,
}: TGlobalDependencies): Generator<any, void, any> {
  const metadata = yield* call(() => walletStorage.get());
  if (metadata === undefined) {
    throw new WalletMetadataNotFoundError();
  }
}

function* loadWalletConnectSession({
  walletConnectStorage,
}: TGlobalDependencies): Generator<any, TStoredWalletConnectData | undefined, any> {
  return yield walletConnectStorage.get();
}

function* deleteWalletConnectSession({
  walletConnectStorage,
}: TGlobalDependencies): Generator<any, void, any> {
  return yield walletConnectStorage.clear();
}

function* restoreUserSession(
  { logger }: TGlobalDependencies,
  jwt: string,
  wcSession: TStoredWalletConnectData | undefined,
): Generator<any, void, any> {
  yield neuCall(makeSureWalletMetaDataExists);
  if (isJwtExpiringLateEnough(jwt)) {
    try {
      yield neuCall(authModuleAPI.sagas.setJwt, jwt);
      yield neuCall(loadUser);
      const walletType = yield select(selectWalletType);

      if (walletType === EWalletType.WALLETCONNECT && wcSession) {
        yield neuCall(walletConnectInit);
      } else if (walletType !== EWalletType.WALLETCONNECT && wcSession) {
        // action.auth.logout will be called automatically after change in local storage
        yield neuCall(deleteWalletConnectSession);
      } else if (walletType === EWalletType.WALLETCONNECT && !wcSession) {
        yield neuCall(handleLogOutUserInternal, ELogoutReason.USER_REQUESTED);
      }

      yield put(actions.auth.finishSigning());
    } catch (e) {
      yield put(actions.auth.logout());
      logger.error(`Cannot retrieve account. ${e}`);
    }
  } else {
    yield put(actions.auth.logout());
    logger.info("JTW expiring too soon.");
  }
}

function* initApp({ logger }: TGlobalDependencies): Generator<any, void, any> {
  try {
    yield neuCall(detectUserAgent);
    const wcSession = yield neuCall(loadWalletConnectSession);
    const jwt = yield neuCall(authModuleAPI.sagas.loadJwt);

    if (jwt) {
      yield neuCall(restoreUserSession, jwt, wcSession);
    } else {
      yield neuCall(deleteWalletConnectSession);
    }
    yield waitUntilSmartContractsAreInitialized();
    yield put(actions.init.done(EInitType.APP_INIT));
  } catch (e) {
    if (e instanceof WalletMetadataNotFoundError) {
      logger.error("User has JWT but no Wallet Metadata", e);
      yield put(actions.auth.logout());
    } else {
      yield put(actions.init.error(EInitType.APP_INIT, e.message || "Unknown error"));
      logger.error("App init error", e);
    }
  }
}

export function* initStartSaga(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.init.start>,
): Generator<any, void, any> {
  const { initType } = action.payload;

  switch (initType) {
    case EInitType.APP_INIT:
      return yield neuCall(initApp);
    case EInitType.SMART_CONTRACTS_INIT:
      return yield neuCall(initSmartcontracts);
    default:
      throw new Error("Unrecognized init type!");
  }
}

export function* checkIfSmartcontractsInitNeeded(): Generator<any, boolean, any> {
  const isDoneOrInProgress: boolean = yield select(
    (s: TAppGlobalState) => s.init.smartcontractsInit.done || s.init.smartcontractsInit.inProgress,
  );

  return !isDoneOrInProgress;
}

export function* initSmartcontractsOnce(): Generator<any, void, any> {
  const isNeeded = yield checkIfSmartcontractsInitNeeded();
  if (!isNeeded) {
    return;
  }

  yield put(actions.init.start(EInitType.SMART_CONTRACTS_INIT));
}

export function* waitUntilSmartContractsAreInitialized(): Generator<any, any, any> {
  const isSmartContractsInitialized = yield select(selectIsSmartContractInitDone);

  if (!isSmartContractsInitialized) {
    yield neuTakeOnly(actions.init.done, { initType: EInitType.SMART_CONTRACTS_INIT as any });
  }
  return;
}

export function* waitForAppInit(): Generator<any, any, any> {
  let appIsReady: boolean = yield select(selectIsAppReady);

  if (!appIsReady) {
    yield neuTakeOnly(actions.init.done, { initType: EInitType.APP_INIT as any });
    appIsReady = true;
  }
  return appIsReady;
}

export const initSagas = function*(): Generator<any, void, any> {
  yield fork(neuTakeEvery, "INIT_START", initStartSaga);
  // Smart Contracts are only initialized once during the whole life cycle of the app
  yield fork(initSmartcontractsOnce);
};
