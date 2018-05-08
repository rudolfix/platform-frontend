import { effects } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";
import { CHANGE_EMAIL_PERMISSION } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { accessWalletAndRunEffect } from "../accessWallet/sagas";
import { TAction } from "../actions";
import { ensurePermissionsArePresent, loadUser, updateUser } from "../auth/sagas";
import { selectUser } from "../auth/selectors";
import { neuCall, neuTakeEvery } from "../sagas";
import { selectWalletType } from "../web3/selectors";
import { WalletType } from "../web3/types";
import { actions } from "./../actions";

export function* addNewEmail(
  { notificationCenter, intlWrapper: { intl: { formatIntlMessage } } }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "SETTINGS_ADD_NEW_EMAIL") return;

  const email = action.payload.email;
  const user = yield select((s: IAppState) => selectUser(s.auth));
  const walletType = yield select((s: IAppState) => selectWalletType(s.web3));

  let addEmailMessage;

  //TODO: Add translations
  try {
    switch (walletType) {
      case WalletType.BROWSER:
        addEmailMessage = "Please confirm on Metamask if the email address is correct";
        break;
      case WalletType.LEDGER:
        addEmailMessage = "Please confirm on your ledger if the email address is correct";
        break;
      case WalletType.LIGHT:
        addEmailMessage =
          "Please confirm through your light wallet if the email address is correct.";
        break;
      default:
        throw new Error("Wrong wallet type");
    }

    yield effects.put(actions.verifyEmail.lockVerifyEmailButton());
    yield neuCall(
      ensurePermissionsArePresent,
      [CHANGE_EMAIL_PERMISSION],
      "Add email",
      addEmailMessage,
    );

    yield effects.call(updateUser, { ...user, new_email: email });
    notificationCenter.info("New Email added");
  } catch {
    yield effects.call(loadUser);
    notificationCenter.error("Failed to send email");
  } finally {
    yield effects.put(actions.verifyEmail.freeVerifyEmailButton());
  }
}

export function* resendEmail(
  { notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "SETTINGS_RESEND_EMAIL") return;

  const user = yield select((s: IAppState) => selectUser(s.auth));
  const email = user.unverifiedEmail;

  try {
    if (!email) throw new Error("No unverified email");

    yield neuCall(
      ensurePermissionsArePresent,
      [CHANGE_EMAIL_PERMISSION],
      "Email Confirmation",
      "Confirm resending activation email.",
    );
    //TODO: Add translations
    yield effects.call(updateUser, { ...user, new_email: email });
    notificationCenter.info("Email successfully resent");
  } catch {
    notificationCenter.error("Failed to resend email");
  }
}

export function* loadSeedOrReturnToSettings(): Iterator<any> {
  // unlock wallet
  try {
    //TODO: Add translations
    const signEffect = put(actions.web3.fetchSeedFromWallet());
    return yield call(
      accessWalletAndRunEffect,
      signEffect,
      "Access recovery phrase",
      "Please confirm to access your recovery phrase.",
    );
  } catch {
    yield put(actions.routing.goToSettings());
  }
}

export const settingsSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "SETTINGS_ADD_NEW_EMAIL", addNewEmail);
  yield fork(neuTakeEvery, "SETTINGS_RESEND_EMAIL", resendEmail);
  yield fork(neuTakeEvery, "LOAD_SEED_OR_RETURN_TO_SETTINGS", loadSeedOrReturnToSettings);
};
