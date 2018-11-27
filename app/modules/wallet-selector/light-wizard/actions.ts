import { createAction, createSimpleAction } from "../../actionsUtils";
import {ErrorWithData} from "../../../components/translatedMessages/errorMessages";

export const lightWizardActions = {
  lightWalletConnectionError: (errorMsg: ErrorWithData) =>
    createAction("LIGHT_WALLET_CONNECTION_ERROR", { errorMsg }),
  lightWalletReset: () => createSimpleAction("LIGHT_WALLET_RESET"),
  lightWalletLogin: (email: string, password: string) =>
    createAction("LIGHT_WALLET_LOGIN", { email, password }),
  lightWalletRecover: (email: string, password: string, seed: string) =>
    createAction("LIGHT_WALLET_RECOVER", { email, password, seed }),
  lightWalletBackedUp: () => createSimpleAction("LIGHT_WALLET_BACKUP"),
  lightWalletRegister: (email: string, password: string) =>
    createAction("LIGHT_WALLET_REGISTER", { email, password }),
};
