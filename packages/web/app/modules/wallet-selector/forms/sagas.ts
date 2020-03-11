import { neuCall, put, select, take } from "@neufund/sagas";

import { GenericErrorMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EUserType } from "../../../lib/api/users/interfaces";
import { TAppGlobalState } from "../../../store";
import { actions } from "../../actions";
import { checkEmailPromise } from "../../auth/email/sagas";
import { getUserMeWithSeedOnly } from "../light-wizard/signing/sagas";
import { TBaseUiData } from "../sagas";
import { selectUrlUserType } from "../selectors";
import {
  ECommonWalletRegistrationFlowState,
  EFlowType,
  TBrowserWalletFormValues,
  TLightWalletFormValues,
} from "../types";

export function* registerForm(
  _: TGlobalDependencies,
  expectedAction:
    | typeof actions.walletSelector.lightWalletRegisterFormData
    | typeof actions.walletSelector.browserWalletRegisterFormData,
  initialFormValues: TBrowserWalletFormValues | TLightWalletFormValues,
  baseUiData: TBaseUiData,
  userEmail?: string,
): Generator<
  any,
  | {
      email: string;
      password: string;
    }
  | undefined,
  any
> {
  yield put(
    actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      initialFormValues,
      uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
    } as const),
  );
  while (true) {
    const { payload } = yield take(expectedAction);

    yield put(
      actions.walletSelector.setWalletRegisterData({
        ...baseUiData,
        uiState: ECommonWalletRegistrationFlowState.REGISTRATION_VERIFYING_EMAIL,
        initialFormValues: {
          ...initialFormValues,
          email: payload.email,
        },
      } as const),
    );

    const isEmailAvailable = yield neuCall(checkEmailPromise, payload.email);

    if (!isEmailAvailable && userEmail !== payload.email) {
      const error = createMessage(GenericErrorMessage.USER_ALREADY_EXISTS);
      yield put(
        actions.walletSelector.setWalletRegisterData({
          ...baseUiData,
          uiState: ECommonWalletRegistrationFlowState.REGISTRATION_EMAIL_VERIFICATION_ERROR,
          errorMessage: error,
          initialFormValues: {
            ...initialFormValues,
            email: payload.email,
          },
        } as const),
      );
    } else {
      return payload;
    }
  }
}

export function* walletRecoverForm(
  _: TGlobalDependencies,
  baseUiData: TBaseUiData,
  seed: string,
): Generator<any, { userType: EUserType; email: string; password: string }, any> {
  const userTypeFromUrl = yield* select((state: TAppGlobalState) =>
    selectUrlUserType(state.router),
  );

  const user = yield* neuCall(getUserMeWithSeedOnly, seed);
  const userEmail = user?.verifiedEmail || user?.unverifiedEmail || "";

  const { email, password } = yield neuCall(
    registerForm,
    actions.walletSelector.lightWalletRegisterFormData,
    {
      email: userEmail,
      password: "",
      repeatPassword: "",
      tos: false,
    },
    { ...baseUiData, flowType: user ? EFlowType.RESTORE_WALLET : EFlowType.IMPORT_WALLET },
    userEmail,
  );
  return { userType: user?.type || userTypeFromUrl, email, password };
}
