import { neuCall, put, race, select, take } from "@neufund/sagas";

import { userMayChooseWallet } from "../../components/wallet-selector/WalletSelectorLogin/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions, TActionFromCreator } from "../actions";
import { isSupportingLedger } from "../user-agent/reducer";
import { EWalletType } from "../web3/types";
import { registerForm } from "./forms/sagas";
import { mapLedgerErrorToErrorMessage } from "./ledger-wizard/errors";
import { loadLedgerAccounts } from "./ledger-wizard/sagas";
import { resetWalletSelectorState, TBaseUiData, walletSelectorReset } from './sagas';
import { selectRegisterWalletDefaultFormValues } from "./selectors";
import { EFlowType, ELedgerRegistrationFlowState, TBrowserWalletFormValues } from "./types";

export function* ledgerConnectAndSign({ ledgerWalletConnector }: TGlobalDependencies, baseUiData: TBaseUiData): Generator<any, boolean, any> {
  try {
    while (true) {
      let connectionOk: boolean;
      try {
        yield put(actions.walletSelector.setWalletRegisterData({
          ...baseUiData,
          uiState: ELedgerRegistrationFlowState.LEDGER_INIT,
          initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues,
        } as const));
        yield ledgerWalletConnector.connect();
        connectionOk = true;
      }
      catch (e) {
        yield put(actions.walletSelector.setWalletRegisterData({
          ...baseUiData,
          uiState: ELedgerRegistrationFlowState.LEDGER_INIT_ERROR,
          errorMessage: mapLedgerErrorToErrorMessage(e),
          initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues,
        } as const));
        connectionOk = false;
      }
      if (connectionOk) {
        break;
      }
      else {
        yield take(actions.walletSelector.ledgerReconnect);
      }
    }
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      uiState: ELedgerRegistrationFlowState.LEDGER_ACCOUNT_CHOOSER,
      initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues,
    } as const));
    yield neuCall(loadLedgerAccounts);
    const { aborted } = yield race({
      success: take(actions.walletSelector.ledgerFinishSettingUpLedgerConnector),
      aborted: take(actions.walletSelector.ledgerCloseAccountChooser),
    });
    return !aborted;
  }
  catch (e) {
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      uiState: ELedgerRegistrationFlowState.LEDGER_INIT_ERROR,
      errorMessage: mapLedgerErrorToErrorMessage(e),
      initialFormValues: (yield* select(selectRegisterWalletDefaultFormValues)) as TBrowserWalletFormValues,
    } as const));
    return false;
  }
}
export function* ensureLedgerIsSupported(_: TGlobalDependencies, baseUiData: TBaseUiData): Generator<any, boolean, any> {
  const ledgerIsSupported = yield* select(isSupportingLedger);
  if (!ledgerIsSupported) {
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      initialFormValues: {
        email: "",
        tos: false,
      },
      uiState: ELedgerRegistrationFlowState.LEDGER_NOT_SUPPORTED,
    } as const));
  }
  return ledgerIsSupported;
}
export function* ledgerRegister(_: TGlobalDependencies, { payload }: TActionFromCreator<typeof actions.walletSelector.registerWithLedger>): Generator<any, void, any> {
  yield neuCall(resetWalletSelectorState);
  const userType = payload.userType;
  const baseUiData = {
    walletType: EWalletType.LEDGER,
    showWalletSelector: userMayChooseWallet(userType),
    rootPath: "/register",
    flowType: EFlowType.REGISTER,
  };
  const initialFormValues: TBrowserWalletFormValues = {
    email: "",
    tos: false,
  };
  try {
    const ledgerIsSupported = yield neuCall(ensureLedgerIsSupported, baseUiData);
    if (!ledgerIsSupported) {
      return;
    }
    while (true) {
      const { email } = yield neuCall(registerForm, actions.walletSelector.browserWalletRegisterFormData, initialFormValues, baseUiData);
      initialFormValues.email = email;
      const success = yield neuCall(ledgerConnectAndSign, baseUiData);
      if (success) {
        return;
      }
    }
  }
  catch (e) {
    yield put(actions.walletSelector.setWalletRegisterData({
      ...baseUiData,
      initialFormValues: {
        email: "",
        tos: false,
      },
      errorMessage: mapLedgerErrorToErrorMessage(e),
      uiState: ELedgerRegistrationFlowState.LEDGER_INIT_ERROR,
    }));
  }
  finally {
    yield walletSelectorReset();
  }
}
