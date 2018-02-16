import { createAction } from "../../actions";
import { IVault } from "../../web3/LightWallet";

export const lightWizzardActions = {
  lightWalletConnectionError: (errorMsg: string) =>
    createAction("LIGHT_WALLET_CONNECTION_ERROR", { errorMsg }),
  lightWalletCreated: (lightWalletVault: IVault) =>
    createAction("LIGHT_WALLET_CREATED", { lightWalletVault }),
};
