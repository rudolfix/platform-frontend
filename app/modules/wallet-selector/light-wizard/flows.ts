import { symbols } from "../../../di/symbols";
import { UsersApi } from "../../../lib/api/UsersApi";
import { VaultApi } from "../../../lib/api/VaultApi";
import { ILogger } from "../../../lib/dependencies/Logger";
import { IStorage } from "../../../lib/dependencies/storage";
import {
  LightCreationError,
  LightDesirializeError,
  LightSignMessageError,
  LightWalletConnector,
  LightWalletUtil,
  LightWrongPasswordSaltError,
} from "../../../lib/web3/LightWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { injectableFn } from "../../../middlewares/redux-injectify";
import { AppDispatch } from "../../../store";
import { actions } from "../../actions";
import { obtainJwt } from "./../../networking/jwt-actions";

const LOCAL_STORAGE_LIGHT_WALLET_KEY = "LIGHT_WALLET";

export const lightWizardFlows = {
  tryConnectingWithLightWallet: (email: string, password: string) =>
    injectableFn(
      async (
        dispatch: AppDispatch,
        web3Manager: Web3Manager,
        lightWalletConnector: LightWalletConnector,
        lightWalletUtil: LightWalletUtil,
        localStorage: IStorage,
        vaultApi: VaultApi,
        usersApi: UsersApi,
        logger: ILogger,
      ) => {
        try {
          const lightWalletVault = await lightWalletUtil.createLightWalletVault({
            password: "password",
            hdPathString: "m/44'/60'/0'",
          });

          const walletInstance = await lightWalletUtil.deserializeLightWalletVault(
            lightWalletVault.walletInstance,
            lightWalletVault.salt,
          );

          localStorage.setKey(LOCAL_STORAGE_LIGHT_WALLET_KEY, lightWalletVault.walletInstance);

          await vaultApi.store(password, lightWalletVault.salt, lightWalletVault.walletInstance);
          const lightWallet = await lightWalletConnector.connect({
            walletInstance,
            salt: lightWalletVault.salt,
          });
          await web3Manager.plugPersonalWallet(lightWallet);
          // tslint:disable-next-line
          await dispatch(obtainJwt);
          await usersApi.createLightwalletAccount(email, lightWalletVault.salt);
          //TODO: add error checking in case of failure
          // redirect user to dashboard
          logger.info("Should redirect");
        } catch (e) {
          logger.warn("Error while trying to connect with light wallet: ", e.message);
          dispatch(actions.wallet.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)));
        }
      },
      [
        symbols.appDispatch,
        symbols.web3Manager,
        symbols.lightWalletConnector,
        symbols.lightWalletUtil,
        symbols.storage,
        symbols.vaultApi,
        symbols.usersApi,
        symbols.logger,
      ],
    ),
};

function mapLightWalletErrorToErrorMessage(e: Error): string {
  if (e instanceof LightWrongPasswordSaltError) {
    return "Password is not correct";
  }
  if (e instanceof LightSignMessageError) {
    return `Cannot sign personal message`;
  }
  if (e instanceof LightCreationError) {
    return "Cannot create new Lightwallet";
  }
  if (e instanceof LightDesirializeError) {
    return "Problem with Vault retrieval";
  }
  return "Light wallet unavailable";
}
