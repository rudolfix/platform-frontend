import { combineReducers } from "redux";
import { EFlowType, ECommonWalletRegistrationFlowState } from "../../types";
import { expectSaga, matchers, providers as sagaProvider } from "@neufund/sagas/tests";

import { walletSelectorReducer, walletSelectorInitialState } from "../../reducer";
import { handleLightWalletError } from "../sagas";
import { lightWalletRegister } from "./sagas";
import { EUserType } from "../../../../lib/api/users/interfaces";
import { actions } from "../../../actions";
import { setupLightWallet } from "../signing/sagas";
import { isEmailAvailablePromise } from "../../../auth/email/sagas";
import { signInUser } from "../../../auth/user/sagas";
import { EWalletType } from "../../../web3/types";

describe("Wallet selector - Light Wizard", () => {
  const payload = {
    email: "ilovemom@test.com",
    password: "bass",
    tos: true,
  };

  describe.only("lightWalletRegister", () => {
    const baseUiData = {
      walletType: EWalletType.LIGHT,
      showWalletSelector: true,
      rootPath: "/register",
      flowType: EFlowType.REGISTER,
    };

    const initialFormValues = {
      email: "",
      password: "",
      repeatPassword: "",
      tos: false,
    };

    it("Runs the happy path when an email is available and login is successful", async () => {
      await expectSaga(
        lightWalletRegister,
        {} as any,
        { payload: { userType: EUserType.INVESTOR } } as any,
      )
        .provide([
          [matchers.call.fn(isEmailAvailablePromise), true],
          [matchers.call.fn(setupLightWallet), undefined],
          [matchers.call.fn(signInUser), undefined],
        ])
        .withReducer(combineReducers({ walletSelector: walletSelectorReducer }))
        .dispatch(
          actions.walletSelector.lightWalletRegisterFormData(
            payload.email,
            payload.password,
            payload.tos,
          ),
        )
        .hasFinalState({
          walletSelector: {
            ...walletSelectorInitialState,
            ...baseUiData,
            showWalletSelector: false,
            initialFormValues: { ...initialFormValues, ...payload },
            uiState: ECommonWalletRegistrationFlowState.REGISTRATION_WALLET_SIGNING,
          },
        })
        .run();
    });
    it("Runs the happy path when an email is available and application throws during lightwallet setup", async () => {
      await expectSaga(
        lightWalletRegister,
        {} as any,
        { payload: { userType: EUserType.INVESTOR } } as any,
      )
        .provide([
          [matchers.call.fn(isEmailAvailablePromise), true],
          [matchers.call.fn(setupLightWallet), sagaProvider.throwError()],
          [matchers.call.fn(signInUser), undefined],
          [matchers.call.fn(handleLightWalletError), undefined],
        ])
        .withReducer(combineReducers({ walletSelector: walletSelectorReducer }))
        .dispatch(
          actions.walletSelector.lightWalletRegisterFormData(
            payload.email,
            payload.password,
            payload.tos,
          ),
        )
        .hasFinalState({
          walletSelector: {
            ...walletSelectorInitialState,
            ...baseUiData,
            showWalletSelector: true,
            initialFormValues: { ...initialFormValues, email: payload.email },
            uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
          },
        })
        .silentRun();
    });
  });
});
