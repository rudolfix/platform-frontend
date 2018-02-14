import { DispatchSymbol } from "../../../getContainer";
import { injectableFn } from "../../../redux-injectify";
import { AppDispatch, IAppAction } from "../../../store";
import { makeActionCreator } from "../../../storeHelpers";
import { EthereumAddress } from "../../../types";
import { ILogger, LoggerSymbol } from "../../../utils/Logger";
import { UsersApi, UsersApiSymbol } from "../../networking/UsersApi";
import { VaultApi, VaultApiSymbol } from "../../networking/VaultApi";
import { StorageSymbol } from "../../storage/storage";
import {
  IVault,
  LightWalletConnector,
  LightWalletConnectorSymbol,
  LightWalletUtil,
  LightWalletUtilSymbol,
} from "../../web3/LightWallet";
import { Web3Manager, Web3ManagerSymbol } from "../../web3/Web3Manager";
import { walletConnectedAction } from "../actions";
import { browserWalletConnectionErrorAction } from "../browser-wizard/actions";
import { obtainJwt } from "./../../networking/jwt-actions";
import { IStorage } from "./../../storage/storage";

const LOCAL_STORAGE_LIGHT_WALLET_KEY = "LIGHT_WALLET";

export interface ILightWalletCreatedAction extends IAppAction {
  type: "LIGHT_WALLET_CREATED";
  payload: {
    lightWalletVault: IVault;
  };
}

export const LightWalletCreatedAction = makeActionCreator<ILightWalletCreatedAction>(
  "LIGHT_WALLET_CREATED",
);

export const tryConnectingWithLightWallet = (email: string, password: string) =>
  injectableFn(
    async (
      dispatch: AppDispatch,
      web3Manager: Web3Manager,
      LightWalletConnector: LightWalletConnector,
      LightWalletUtil: LightWalletUtil,
      localStorage: IStorage,
      vaultApi: VaultApi,
      usersApi: UsersApi,
      logger: ILogger,
    ) => {
      try {
        const lightWalletVault = await LightWalletUtil.createLightWalletVault({
          password: "password",
          hdPathString: "m/44'/60'/0'",
        });

        const walletInstance = await LightWalletUtil.deserializeLightWalletVault(
          lightWalletVault.walletInstance,
          lightWalletVault.salt,
        );

        localStorage.setKey(LOCAL_STORAGE_LIGHT_WALLET_KEY, lightWalletVault.walletInstance);

        await vaultApi.store(password, lightWalletVault.salt, lightWalletVault.walletInstance);
        const lightWallet = await LightWalletConnector.connect(
          {
            walletInstance,
            salt: lightWalletVault.salt,
          },
          LightWalletUtil.addPrefixToAddress(walletInstance.addresses[0]) as EthereumAddress,
        );
        await web3Manager.plugPersonalWallet(lightWallet);
        dispatch(obtainJwt);
        await usersApi.createLightwalletAccount(email, lightWalletVault.salt);
        //TODO: add error checking in case of failure
        // redirect user to dashboard
        dispatch(walletConnectedAction);
      } catch (e) {
        logger.warn("Error while trying to connect with light wallet: ", e.message);
        dispatch(
          browserWalletConnectionErrorAction({ errorMsg: "Something went wrong real wrong" }),
        );
      }
    },
    [
      DispatchSymbol,
      Web3ManagerSymbol,
      LightWalletConnectorSymbol,
      LightWalletUtilSymbol,
      StorageSymbol,
      VaultApiSymbol,
      UsersApiSymbol,
      LoggerSymbol,
    ],
  );
