import { effects } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";

import { ProfileMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { CHANGE_EMAIL_PERMISSION } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EmailAlreadyExists } from "../../lib/api/users/UsersApi";
import { IAppState } from "../../store";
import { accessWalletAndRunEffect } from "../access-wallet/sagas";
import { actions, TAction } from "../actions";
import { MessageSignCancelledError } from "../auth/errors";
import { ensurePermissionsArePresent } from "../auth/jwt/sagas";
import { selectDoesEmailExist, selectUser } from "../auth/selectors";
import { loadUser, updateUser } from "../auth/user/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectLightWalletSalt, selectPreviousLightWalletSalt } from "../web3/selectors";

export function* addNewEmail(
  { notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "PROFILE_ADD_NEW_EMAIL") return;

  const email = action.payload.email;
  const user = yield select((s: IAppState) => selectUser(s.auth));
  const salt = yield select(
    (s: IAppState) => selectLightWalletSalt(s.web3) || selectPreviousLightWalletSalt(s.web3),
  );
  const isEmailAvailable = yield select((s: IAppState) => selectDoesEmailExist(s.auth));

  const emailModalTitle = isEmailAvailable
    ? createMessage(ProfileMessage.PROFILE_UPDATE_EMAIL_TITLE)
    : createMessage(ProfileMessage.PROFILE_ADD_EMAIL_TITLE);

  try {
    yield effects.put(actions.verifyEmail.lockVerifyEmailButton());
    yield neuCall(
      ensurePermissionsArePresent,
      [CHANGE_EMAIL_PERMISSION],
      emailModalTitle,
      createMessage(ProfileMessage.PROFILE_ADD_EMAIL_CONFIRM),
    );
    yield effects.call(updateUser, { ...user, new_email: email, salt: salt });
    notificationCenter.info(createMessage(ProfileMessage.PROFILE_NEW_EMAIL_ADDED));
  } catch (e) {
    if (e instanceof EmailAlreadyExists)
      notificationCenter.error(createMessage(ProfileMessage.PROFILE_EMAIL_ALREADY_EXISTS));
    else {
      logger.error("Failed to Add new email", e);
      notificationCenter.error(createMessage(ProfileMessage.PROFILE_ADD_EMAIL_ERROR));
    }
  } finally {
    yield loadUser();
    yield effects.put(actions.verifyEmail.freeVerifyEmailButton());
  }
}

export function* resendEmail(
  { notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "PROFILE_RESEND_EMAIL") return;

  const user = yield select((s: IAppState) => selectUser(s.auth));
  const email = user.unverifiedEmail;
  const salt = yield select(
    (s: IAppState) => selectLightWalletSalt(s.web3) || selectPreviousLightWalletSalt(s.web3),
  );

  try {
    if (!email) throw new Error("No unverified email");

    yield neuCall(
      ensurePermissionsArePresent,
      [CHANGE_EMAIL_PERMISSION],
      createMessage(ProfileMessage.PROFILE_RESEND_EMAIL_LINK_CONFIRMATION_TITLE),
      createMessage(ProfileMessage.PROFILE_RESEND_EMAIL_LINK_CONFIRMATION_DESCRIPTION),
    );
    yield effects.call(updateUser, { ...user, new_email: email, salt: salt });
    notificationCenter.info(createMessage(ProfileMessage.PROFILE_EMAIL_VERIFICATION_SENT));
  } catch (e) {
    logger.error("Failed to resend email", e);
    notificationCenter.error(
      createMessage(ProfileMessage.PROFILE_EMAIL_VERIFICATION_SENDING_FAILED),
    );
  }
}

export function* loadSeedOrReturnToSettings({ logger }: TGlobalDependencies): Iterator<any> {
  // unlock wallet
  try {
    const signEffect = put(actions.web3.fetchWalletPrivateDataFromWallet());
    return yield call(
      accessWalletAndRunEffect,
      signEffect,
      createMessage(ProfileMessage.PROFILE_ACCESS_RECOVERY_PHRASE_TITLE),
      createMessage(ProfileMessage.PROFILE_ACCESS_RECOVERY_PHRASE_DESCRIPTION),
    );
  } catch (error) {
    if (error instanceof MessageSignCancelledError) {
      logger.info("Signing Cancelled");
    } else {
      logger.error("Failed to load seed", error);
    }
    yield put(actions.routing.goToProfile());
  }
}

export function* profileSagas(): any {
  yield fork(neuTakeEvery, "PROFILE_ADD_NEW_EMAIL", addNewEmail);
  yield fork(neuTakeEvery, "PROFILE_RESEND_EMAIL", resendEmail);
  yield fork(neuTakeEvery, "LOAD_SEED_OR_RETURN_TO_PROFILE", loadSeedOrReturnToSettings);
}
