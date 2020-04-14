import { call, delay, fork, put, race, select, take } from "@neufund/sagas";
import { assertNever, minutesToMs, safeDelay, secondsToMs } from "@neufund/shared";
import { authModuleAPI, EJwtPermissions, EUserType } from "@neufund/shared-modules";

import { SignInUserErrorMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EUserActivityMessage } from "../../../lib/dependencies/broadcast-channel/types";
import { REGISTRATION_LOGIN_DONE } from "../../../lib/persistence/UserStorage";
import { TStoredWalletMetadata } from "../../../lib/persistence/WalletStorage";
import {
  SignerRejectConfirmationError,
  SignerTimeoutError,
  SignerUnknownError,
} from "../../../lib/web3/Web3Manager/Web3Manager";
import { TAppGlobalState } from "../../../store";
import { actions, TActionFromCreator } from "../../actions";
import { EInitType } from "../../init/reducer";
import { loadKycRequestData } from "../../kyc/sagas";
import { selectRedirectURLFromQueryString } from "../../routing/selectors";
import { neuCall, neuTakeLatest, neuTakeLatestUntil, neuTakeUntil } from "../../sagasUtils";
import { selectUrlUserType } from "../../wallet-selector/selectors";
import { TWalletMetadata } from "../../web3/types";
import { AUTH_INACTIVITY_THRESHOLD } from "../constants";
import { checkForPendingEmailVerification } from "../email/sagas";
import { selectIsThereUnverifiedEmail, selectUserType } from "../selectors";
import { ELogoutReason } from "../types";
import { loadUser, logoutUser } from "./external/sagas";

/**
 * Waits for user to conduct activity before a
 * preset time limit if the time runs out, log
 * out the user.
 *
 * This saga also takes into account actions
 * done by other tabs
 */
export function* waitForUserActiveOrLogout({
  logger,
  userActivityChannel,
}: TGlobalDependencies): Generator<any, any, any> {
  while (true) {
    const { logout, active } = yield race({
      logout: safeDelay(AUTH_INACTIVITY_THRESHOLD),
      active: take(actions.auth.userActive.getType()),
      refresh: take(actions.auth.refreshTimer.getType()),
    });
    // safeDelay sometimes returns 0 or 1
    if (logout !== undefined) {
      logger.info("User is inactive logging out");

      yield put(actions.auth.userActivityTimeout());
    }
    if (active) {
      yield userActivityChannel.postMessage({
        status: EUserActivityMessage.USER_ACTIVE,
      });
    }
  }
}

export function* signInUser({
  walletStorage,
  web3Manager,
  userStorage,
}: TGlobalDependencies): Generator<any, any, any> {
  try {
    // we will try to create with user type from URL but it could happen that account already exists and has different user type
    const probableUserType: EUserType = yield select((s: TAppGlobalState) =>
      selectUrlUserType(s.router),
    );

    const metadata = web3Manager.personalWallet!.getMetadata();

    yield neuCall(authModuleAPI.sagas.createJwt, [EJwtPermissions.SIGN_TOS]); // by default we have the sign-tos permission, as this is the first thing a user will have to do after signup

    yield call(loadOrCreateUser, probableUserType, metadata);
    yield call(checkForPendingEmailVerification);

    const userType: EUserType = yield select(selectUserType);
    const storedWalletMetadata: TStoredWalletMetadata = {
      ...metadata,
      userType,
    };
    yield* call(() => walletStorage.set(storedWalletMetadata));

    // For other open browser pages
    yield* call(() => userStorage.set(REGISTRATION_LOGIN_DONE));

    const redirectionUrl = yield select(selectRedirectURLFromQueryString);

    yield put(actions.auth.finishSigning());

    if (redirectionUrl) {
      yield put(actions.routing.push(redirectionUrl));
    } else {
      yield put(actions.routing.goToDashboard());
    }
  } catch (e) {
    if (e instanceof SignerRejectConfirmationError || e instanceof SignerTimeoutError) {
      throw e;
    } else {
      throw new SignerUnknownError();
    }
  }
}

export function* loadOrCreateUser(
  userType: EUserType,
  metadata: TWalletMetadata,
): Generator<any, any, any> {
  yield* call(authModuleAPI.sagas.loadOrCreateUser, { userType, ...metadata });

  yield neuCall(loadKycRequestData);
}

function* handleLogOutUser(
  { logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.auth.logout>,
): Generator<any, any, any> {
  const { logoutType = ELogoutReason.USER_REQUESTED } = action.payload;

  yield neuCall(logoutUser);

  switch (logoutType) {
    case ELogoutReason.USER_REQUESTED:
      {
        yield put(actions.routing.goHome());
      }
      break;
    case ELogoutReason.SESSION_TIMEOUT:
      yield put(actions.routing.goToLogin({ logoutReason: ELogoutReason.SESSION_TIMEOUT }));
      break;
    case ELogoutReason.ALREADY_LOGGED_IN:
      logger.warn(
        new Error(
          "Seems like there is already active session. Please check the reason as this may be a potential bug.",
        ),
      );
      // no action is required
      break;
    default:
      assertNever(logoutType);
  }

  yield put(actions.init.start(EInitType.APP_INIT));
}

export function* handleSignInUser({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    yield neuCall(signInUser);
  } catch (e) {
    logger.error("User Sign in error", e);

    if (e instanceof SignerRejectConfirmationError) {
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_REJECTED),
        ),
      );
    } else if (e instanceof SignerTimeoutError) {
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_TIMEOUT),
        ),
      );
    } else {
      yield put(
        actions.walletSelector.messageSigningError(
          createMessage(SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE),
        ),
      );
    }
  }
}

const UNVERIFIED_EMAIL_REFRESH_DELAY = secondsToMs(5);
const NO_UNVERIFIED_EMAIL_REFRESH_DELAY = minutesToMs(5);

function* profileMonitor({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    const isThereUnverifiedEmail = yield select(selectIsThereUnverifiedEmail);

    const delayTime = isThereUnverifiedEmail
      ? UNVERIFIED_EMAIL_REFRESH_DELAY
      : NO_UNVERIFIED_EMAIL_REFRESH_DELAY;

    yield delay(delayTime);

    yield neuCall(loadUser);
  } catch (e) {
    logger.error("Error getting profile data", e);
  }
}

export function* authUserSagas(): Generator<any, any, any> {
  yield fork(neuTakeLatest, actions.auth.logout, handleLogOutUser);
  yield fork(
    neuTakeUntil,
    authModuleAPI.actions.setUser,
    actions.auth.logout,
    waitForUserActiveOrLogout,
  );
  yield fork(
    neuTakeLatestUntil,
    authModuleAPI.actions.setUser,
    actions.auth.logout,
    profileMonitor,
  );
}
