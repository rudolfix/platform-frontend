import { IVault } from "../../../lib/web3/LightWallet";
import { createAction } from "../../actionsUtils";

export const lightWizzardActions = {
  lightWalletConnectionError: (errorMsg: string) =>
    createAction("LIGHT_WALLET_CONNECTION_ERROR", { errorMsg }),
  lightWalletCreated: (lightWalletVault: IVault) =>
    createAction("LIGHT_WALLET_CREATED", { lightWalletVault }),
};
