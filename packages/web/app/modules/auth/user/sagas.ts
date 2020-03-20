import { call, delay, fork, put, race, select, take } from "@neufund/sagas";
import { assertNever, EJwtPermissions, minutesToMs, safeDelay, secondsToMs } from "@neufund/shared";

import { SignInUserErrorMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EUserType, IUser } from "../../../lib/api/users/interfaces";
import { UserNotExisting } from "../../../lib/api/users/UsersApi";
import { EUserActivityMessage } from "../../../lib/dependencies/broadcast-channel/types";
import { REGISTRATION_LOGIN_DONE } from "../../../lib/persistence/UserStorage";
import {
  SignerRejectConfirmationError,
  SignerTimeoutError,
  SignerUnknownError,
  WalletNotConnectedError,
} from "../../../lib/web3/Web3Manager/Web3Manager";
import { TAppGlobalState } from "../../../store";
import { actions, TActionFromCreator } from "../../actions";
import { EInitType } from "../../init/reducer";
import { loadKycRequestData } from "../../kyc/sagas";
import { selectRedirectURLFromQueryString } from "../../routing/selectors";
import {
  neuCall,
  neuTakeEvery,
  neuTakeLatest,
  neuTakeLatestUntil,
  neuTakeUntil,
} from "../../sagasUtils";
import {
  getCurrentAgreementHash,
  handleAcceptCurrentAgreement,
} from "../../terms-of-service/sagas";
import { EWalletType } from "../../web3/types";
import { AUTH_INACTIVITY_THRESHOLD } from "../constants";
import { checkForPendingEmailVerification } from "../email/sagas";
import { createJwt } from "../jwt/sagas";
import { selectIsThereUnverifiedEmail, selectUserType } from "../selectors";
import { ELogoutReason } from "../types";
import { loadUser, logoutUser } from "./external/sagas";
import { getUsersNewEmailValue } from "./utils";

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

export function* signInUser(
  { walletStorage, web3Manager, userStorage }: TGlobalDependencies,
  userType: EUserType,
  email?: string,
  tos: boolean = false,
): Generator<any, any, any> {
  try {
    yield neuCall(createJwt, [EJwtPermissions.SIGN_TOS, EJwtPermissions.CHANGE_EMAIL_PERMISSION]);
    yield neuCall(loadOrCreateUser, userType, email, tos);
    if (tos) yield neuCall(handleAcceptCurrentAgreement);
    yield call(checkForPendingEmailVerification);

    const walletMetadataUserType = yield* select(selectUserType);

    if (!walletMetadataUserType) {
      throw new Error("User must be defined at this moment");
    }

    if (!web3Manager.personalWallet) {
      throw new WalletNotConnectedError(web3Manager.personalWallet!);
    }

    const storedWalletMetadata = {
      ...web3Manager.personalWallet.getMetadata(),
      userType: walletMetadataUserType,
    };
    walletStorage.set(storedWalletMetadata);

    // For other open browser pages
    yield userStorage.set(REGISTRATION_LOGIN_DONE);

    const redirectionUrl = yield select(selectRedirectURLFromQueryString);

    yield put(actions.auth.finishSigning());

    yield put(
      redirectionUrl ? actions.routing.push(redirectionUrl) : actions.routing.goToDashboard(),
    );
  } catch (e) {
    yield neuCall(logoutUser);
    if (e instanceof SignerRejectConfirmationError || e instanceof SignerTimeoutError) {
      throw e;
    } else {
      throw new SignerUnknownError();
    }
  }
}

/**
 * A wrapper around UsersApi me method
 *
 * @returns IUser if the user exists and undefined if the user doesn't exist
 *
 * @note This is used when `UserNotExisting` is expected to happen and relying on catch as
 * a regular flow disrupts the linear flow of the saga
 *
 * @see loadOrCreateUser
 */
function* getUsersMeFromApi({
  apiUserService,
}: TGlobalDependencies): Generator<any, IUser | undefined, any> {
  try {
    const user = yield* call(() => apiUserService.me());
    return user;
  } catch (error) {
    if (error instanceof UserNotExisting) {
      return undefined;
    } else {
      throw error;
    }
  }
}

/**
 * @generator create or load the user depending on the response coming from `usersApi/me` method
 */
export function* loadOrCreateUser(
  { apiUserService, web3Manager }: TGlobalDependencies,
  userType: EUserType,
  email?: string,
  tos: boolean = false,
): Generator<any, void, any> {
  if (!web3Manager.personalWallet) {
    throw new Error("Personal Wallet must be plugged");
  }
  const walletMetadata = web3Manager.personalWallet.getMetadata();

  const userFromApi = yield* neuCall(getUsersMeFromApi);
  let user;
  if (userFromApi) {
    user = yield* call(apiUserService.updateUser, {
      ...userFromApi,
      salt: walletMetadata.salt,
      walletType: walletMetadata.walletType,
      walletSubtype: walletMetadata.walletSubType,
      newEmail: getUsersNewEmailValue(userFromApi.verifiedEmail, email),
    });
  } else {
    user = yield* call(apiUserService.createAccount, {
      newEmail: email || walletMetadata?.email,
      backupCodesVerified: walletMetadata?.walletType === EWalletType.LIGHT ? false : true,
      salt: walletMetadata?.salt,
      type: userType,
      walletType: walletMetadata.walletType,
      walletSubtype: walletMetadata.walletSubType,
    });
  }

  if (tos) {
    const currentAgreementHash = yield* neuCall(getCurrentAgreementHash);
    yield apiUserService.setLatestAcceptedTos(currentAgreementHash);
  }

  yield put(actions.auth.setUser(user));

  yield neuCall(loadKycRequestData);
}

export function* setUser(
  { logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.auth.setUser>,
): Generator<any, any, any> {
  const user = action.payload.user;
  logger.setUser({ id: user.userId, type: user.type, walletType: user.walletType });
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

  logger.setUser(null);
}

export function mapSignInErrors(e: Error): SignInUserErrorMessage {
  // fixme move to utils
  if (e instanceof SignerRejectConfirmationError) {
    return SignInUserErrorMessage.MESSAGE_SIGNING_REJECTED;
  } else if (e instanceof SignerTimeoutError) {
    return SignInUserErrorMessage.MESSAGE_SIGNING_TIMEOUT;
  } else {
    return SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE;
  }
}

export function* handleSignInUser(
  { logger }: TGlobalDependencies,
  userType: EUserType,
  email?: string,
  tos = false,
): Generator<any, void, any> {
  try {
    yield neuCall(signInUser, userType, email, tos);
  } catch (e) {
    logger.error("User Sign in error", e);

    const error = yield mapSignInErrors(e);

    yield put(actions.walletSelector.messageSigningError(createMessage(error)));
  }
}

const UNVERIFIED_EMAIL_REFRESH_DELAY = secondsToMs(5);
const NO_UNVERIFIED_EMAIL_REFRESH_DELAY = minutesToMs(5);

function* profileMonitor({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    const isThereUnverifiedEmail = yield select((state: TAppGlobalState) =>
      selectIsThereUnverifiedEmail(state.auth),
    );

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
  yield fork(neuTakeEvery, actions.auth.setUser, setUser);
  yield fork(neuTakeUntil, actions.auth.setUser, actions.auth.logout, waitForUserActiveOrLogout);
  yield fork(neuTakeLatestUntil, actions.auth.setUser, actions.auth.logout, profileMonitor);
}
