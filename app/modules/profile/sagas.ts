import { effects } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";

import { CHANGE_EMAIL_PERMISSION } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EmailAlreadyExists } from "../../lib/api/users/UsersApi";
import { IAppState } from "../../store";
import { accessWalletAndRunEffect } from "../access-wallet/sagas";
import { actions, TAction } from "../actions";
import { MessageSignCancelledError } from "../auth/errors";
import { ensurePermissionsArePresent, loadUser, updateUser } from "../auth/sagas";
import { selectDoesEmailExist, selectUser } from "../auth/selectors";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectLightWalletSalt, selectPreviousLightWalletSalt } from "../web3/selectors";

export function* addNewEmail(
  {
    notificationCenter,
    logger,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
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
    ? formatIntlMessage("modules.settings.sagas.add-new-email.update-title")
    : formatIntlMessage("modules.settings.sagas.add-new-email.add-title");

  try {
    yield effects.put(actions.verifyEmail.lockVerifyEmailButton());
    yield neuCall(
      ensurePermissionsArePresent,
      [CHANGE_EMAIL_PERMISSION],
      emailModalTitle,
      formatIntlMessage("modules.settings.sagas.add-new-email.confirm-description"),
    );
    yield effects.call(updateUser, { ...user, new_email: email, salt: salt });
    notificationCenter.info(
      formatIntlMessage("modules.settings.sagas.add-new-email.new-email-added"),
    );
  } catch (e) {
    if (e instanceof EmailAlreadyExists)
      notificationCenter.error(
        formatIntlMessage("modules.auth.sagas.sign-in-user.email-already-exists"),
      );
    else {
      logger.error("Failed to Add new email", e);
      notificationCenter.error(formatIntlMessage("modules.settings.sagas.add-new-email.error"));
    }
  } finally {
    yield loadUser();
    yield effects.put(actions.verifyEmail.freeVerifyEmailButton());
  }
}

export function* resendEmail(
  {
    notificationCenter,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
    logger,
  }: TGlobalDependencies,
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
      formatIntlMessage("modules.settings.sagas.resend-email.confirmation"),
      formatIntlMessage("modules.settings.sagas.resend-email.confirmation-description"),
    );
    yield effects.call(updateUser, { ...user, new_email: email, salt: salt });
    notificationCenter.info(formatIntlMessage("modules.settings.sagas.resend-email.sent"));
  } catch (e) {
    logger.error("Failed to resend email", e);
    notificationCenter.error(formatIntlMessage("modules.settings.sagas.resend-email.failed"));
  }
}

export function* loadSeedOrReturnToSettings({
  intlWrapper: {
    intl: { formatIntlMessage },
  },
  logger,
}: TGlobalDependencies): Iterator<any> {
  // unlock wallet
  try {
    const signEffect = put(actions.web3.fetchSeedFromWallet());
    return yield call(
      accessWalletAndRunEffect,
      signEffect,
      formatIntlMessage(
        "modules.settings.sagas.load-seed-return-settings.access-recovery-phrase-title",
      ),
      formatIntlMessage(
        "modules.settings.sagas.load-seed-return-settings.access-recovery-phrase-description",
      ),
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

export const profileSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "PROFILE_ADD_NEW_EMAIL", addNewEmail);
  yield fork(neuTakeEvery, "PROFILE_RESEND_EMAIL", resendEmail);
  yield fork(neuTakeEvery, "LOAD_SEED_OR_RETURN_TO_PROFILE", loadSeedOrReturnToSettings);
};
