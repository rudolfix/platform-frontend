import { APP_DISPATCH_SYMBOL } from "../../../getContainer";
import { injectableFn } from "../../../redux-injectify";
import { AppDispatch } from "../../../store";
import { ILogger, LOGGER_SYMBOL } from "../../../utils/Logger";
import { actions } from "../../actions";
import { USERS_API_SYMBOL, UsersApi } from "../../networking/UsersApi";
import { VAULT_API_SYMBOL, VaultApi } from "../../networking/VaultApi";
import { STORAGE_SYMBOL } from "../../storage/storage";
import {
  LIGHT_WALLET_CONNECTOR_SYMBOL,
  LIGHT_WALLET_UTIL_SYMBOL,
  LightCreationError,
  LightDesirializeError,
  LightSignMessageError,
  LightWalletConnector,
  LightWalletUtil,
  LightWrongPasswordSaltError,
} from "../../web3/LightWallet";
import { WEB3_MANAGER_SYMBOL, Web3Manager } from "../../web3/Web3Manager";
import { obtainJwt } from "./../../networking/jwt-actions";
import { IStorage } from "./../../storage/storage";

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
        APP_DISPATCH_SYMBOL,
        WEB3_MANAGER_SYMBOL,
        LIGHT_WALLET_CONNECTOR_SYMBOL,
        LIGHT_WALLET_UTIL_SYMBOL,
        STORAGE_SYMBOL,
        VAULT_API_SYMBOL,
        USERS_API_SYMBOL,
        LOGGER_SYMBOL,
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
