import { fork, put, select } from "@neufund/sagas";
import { includes } from "lodash/fp";

import {
  EUnverifiedEmailReminderModalType,
  UnverifiedEmailReminderModal,
} from "../../../components/modals/unverified-email-reminder/UnverifiedEmailReminderModal";
import { AuthMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { USERS_WITH_ACCOUNT_SETUP } from "../../../config/constants";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { IVerifyEmailUser } from "../../../lib/api/users/interfaces";
import { EmailAlreadyExists } from "../../../lib/api/users/UsersApi";
import { TStoredWalletMetadata } from "../../../lib/persistence/WalletStorage";
import { TAppGlobalState } from "../../../store";
import { actions } from "../../actions";
import { userHasKycAndEmailVerified } from "../../eto-flow/selectors";
import { selectIsVerifyEmailRedirect } from "../../routing/selectors";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import {
  selectActivationCodeFromQueryString,
  selectEmailFromQueryString,
  selectWalletType,
} from "../../web3/selectors";
import { EWalletType } from "../../web3/types";
import {
  selectIsAgreementAccepted,
  selectUnverifiedUserEmail,
  selectUserEmail,
  selectUserType,
  selectVerifiedUserEmail,
} from "../selectors";
import { ELogoutReason } from "../types";
import { loadUser } from "../user/external/sagas";

/**
 * Email Verification
 */
export function* verifyUserEmail({
  notificationCenter,
  walletStorage,
}: TGlobalDependencies): Generator<any, any, any> {
  const userCode = yield* select(selectActivationCodeFromQueryString);
  const urlEmail = yield* select(selectEmailFromQueryString);
  const userEmail = yield* select((s: TAppGlobalState) => selectUserEmail(s.auth));

  if (userCode === undefined || urlEmail === undefined) {
    yield put(actions.auth.logout());
    yield notificationCenter.error(
      {
        messageType: AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED,
      },
      { "data-test-id": "modules.auth.sagas.verify-user-email.toast.verification-failed" },
    );
    return;
  }

  if (userEmail && userEmail !== urlEmail) {
    // Logout if there is different user session active
    yield put(actions.auth.logout({ logoutType: ELogoutReason.ALREADY_LOGGED_IN }));
    yield notificationCenter.error(
      {
        messageType: AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED_SAME_EMAIL,
      },
      { "data-test-id": "modules.auth.sagas.verify-user-email.toast.verification-failed" },
    );
    return;
  }

  const verifiedEmail = yield* select((s: TAppGlobalState) => selectVerifiedUserEmail(s.auth));

  yield neuCall(verifyUserEmailPromise, userCode, urlEmail, verifiedEmail);
  yield neuCall(loadUser);

  const walletMetadata = walletStorage.get();
  // Update metadata email only when wallet type is LightWallet
  if (walletMetadata && walletMetadata.walletType === EWalletType.LIGHT) {
    const updatedMetadata: TStoredWalletMetadata = { ...walletMetadata, email: urlEmail };
    walletStorage.set(updatedMetadata);
  }

  const userType = yield* select((s: TAppGlobalState) => selectUserType(s));
  const kycAndEmailVerified = yield* select((s: TAppGlobalState) => userHasKycAndEmailVerified(s));

  if (!kycAndEmailVerified && includes(userType, USERS_WITH_ACCOUNT_SETUP)) {
    yield put(actions.routing.goToDashboard());
  } else {
    yield put(actions.routing.goToProfile());
  }
}

export async function verifyUserEmailPromise(
  { apiUserService, notificationCenter }: TGlobalDependencies,
  userCode: IVerifyEmailUser,
  urlEmail: string,
  verifiedEmail: string | undefined,
): Promise<void> {
  if (urlEmail === verifiedEmail) {
    notificationCenter.info(createMessage(AuthMessage.AUTH_EMAIL_ALREADY_VERIFIED));
    return;
  }
  if (!userCode) return;
  try {
    await apiUserService.verifyUserEmail(userCode);
    notificationCenter.info(createMessage(AuthMessage.AUTH_EMAIL_VERIFIED));
  } catch (e) {
    if (e instanceof EmailAlreadyExists) {
      notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_ALREADY_EXISTS));
    } else {
      notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED));
    }
  }
}

export async function checkEmailPromise(
  { apiUserService }: TGlobalDependencies,
  email: string,
): Promise<boolean> {
  const emailStatus = await apiUserService.emailStatus(email);
  return emailStatus.isAvailable;
}

export function* checkForPendingEmailVerification(): Generator<any, void, any> {
  const tosAccepted = yield* select(selectIsAgreementAccepted);
  const unverifiedEmail = yield* select(selectUnverifiedUserEmail);

  // this is a workaround for #3942 (see QA's comment).
  // this can be done in a much nicer way after implementing route-based saga approach
  // TODO refactor after we move to route-based sagas
  const verifyEmailRedirect = yield select(selectIsVerifyEmailRedirect);

  if (!verifyEmailRedirect && unverifiedEmail !== undefined && tosAccepted) {
    const walletType = yield* select(selectWalletType);
    yield put(
      actions.genericModal.showModal(UnverifiedEmailReminderModal, {
        unverifiedEmail,
        modalType:
          walletType === EWalletType.LIGHT
            ? EUnverifiedEmailReminderModalType.LIGHT_WALLET_UNVERIFIED_EMAIL_REMINDER_MODAL
            : EUnverifiedEmailReminderModalType.BROWSER_LEDGER_UNVERIFIED_EMAIL_REMINDER_MODAL,
      }),
    );
  }
}

export function* authEmailSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.auth.verifyEmail, verifyUserEmail);
}
