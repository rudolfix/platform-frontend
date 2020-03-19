import { expectSaga, matchers } from "@neufund/sagas/tests";
import { combineReducers } from "redux";

import { EUserType } from "../../../lib/api/users/interfaces";
import { actions } from "../../actions";
import { isEmailAvailablePromise } from "../../auth/email/sagas";
import { signInUser } from "../../auth/user/sagas";
import { EWalletType } from "../../web3/types";
import { walletSelectorReducer } from "../reducer";
import { ECommonWalletRegistrationFlowState, EFlowType } from "../types";
import { EFlowType } from "./../types";
import { ERecoveryPhase } from "./reducer";
import { lightWalletRestore } from "./sagas";
import { getUserMeWithSeedOnly, setupLightWallet } from "./signing/sagas";

describe("Wallet selector - Light Wallet Restore", () => {
  const payload = {
    email: "ilovemom@test.com",
    password: "bass",
    tos: true,
  };

  describe("lightWalletRestore", () => {
    const baseUiData = {
      walletType: EWalletType.LIGHT,
      flowType: EFlowType.IMPORT_WALLET,
      showWalletSelector: false,
      rootPath: "/restore",
    };

    const initialFormValues = {
      email: "",
      password: "",
      repeatPassword: "",
      tos: false,
    };

    it("should yield the import wallet flow", async () => {
      await expectSaga(lightWalletRestore, {} as any)
        .provide([
          [matchers.call.fn(isEmailAvailablePromise), true],
          [matchers.call.fn(setupLightWallet), undefined],
          [matchers.call.fn(signInUser), undefined],
          [matchers.call.fn(getUserMeWithSeedOnly), undefined],
        ])
        .dispatch(actions.walletSelector.submitSeed("seed"))
        .put(actions.walletSelector.setRecoveryPhase(ERecoveryPhase.FORM_ENTRY_COMPONENT))
        .withReducer(combineReducers({ walletSelector: walletSelectorReducer }))
        .put(
          actions.walletSelector.setWalletRegisterData({
            ...baseUiData,
            initialFormValues,
            flowType: EFlowType.IMPORT_WALLET,
            uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
          }),
        )
        .silentRun();
    });
    it("should yield the restore wallet flow with the already available email", async () => {
      await expectSaga(lightWalletRestore, {} as any)
        .provide([
          [matchers.call.fn(isEmailAvailablePromise), true],
          [matchers.call.fn(setupLightWallet), undefined],
          [matchers.call.fn(signInUser), undefined],
          [
            matchers.call.fn(getUserMeWithSeedOnly),
            { verifiedEmail: "mommyIloveyou@super.com", type: EUserType.ISSUER },
          ],
        ])
        .dispatch(actions.walletSelector.submitSeed("seed"))
        .put(actions.walletSelector.setRecoveryPhase(ERecoveryPhase.FORM_ENTRY_COMPONENT))
        .withReducer(combineReducers({ walletSelector: walletSelectorReducer }))
        .put(
          actions.walletSelector.setWalletRegisterData({
            ...baseUiData,
            initialFormValues: { ...initialFormValues, email: "mommyIloveyou@super.com" },
            flowType: EFlowType.RESTORE_WALLET,
            uiState: ECommonWalletRegistrationFlowState.REGISTRATION_FORM,
          }),
        )
        .silentRun();
    });
  });
});
