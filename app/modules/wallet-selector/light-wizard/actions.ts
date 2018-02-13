import { DispatchSymbol } from "../../../getContainer";
import { injectableFn } from "../../../redux-injectify";
import { AppDispatch, IAppAction } from "../../../store";
import { makeActionCreator } from "../../../storeHelpers";
import { UsersApi, UsersApiSymbol } from "../../networking/UsersApi";
import { VaultApi, VaultApiSymbol } from "../../networking/VaultApi";
import { Storage, StorageSymbol } from "../../storage/storage";
import {
  CreateLightWalletValueSymbol,
  CreateLightWalletVaultType,
  deserializeLightWalletVaultType,
  IVault,
  LightWalletConnector,
} from "../../web3/LightWallet";
import { Web3Manager, Web3ManagerSymbol } from "../../web3/Web3Manager";
import { obtainJwt } from "./../../networking/jwt-actions";

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
      createLightWalletVault: CreateLightWalletVaultType,
      deserializeLightWalletVault: deserializeLightWalletVaultType,
      localStorage: Storage,
      vaultApi: VaultApi,
      usersApi: UsersApi,
    ) => {
      const lightWalletVault = await createLightWalletVault({
        password: "password",
        hdPathString: "m/44'/60'/0'",
      });

      const walletInstance = await deserializeLightWalletVault(
        lightWalletVault.walletInstance,
        lightWalletVault.salt,
      );

      localStorage.setKey(LOCAL_STORAGE_LIGHT_WALLET_KEY, lightWalletVault.walletInstance);

      await vaultApi.store(password, lightWalletVault.salt, lightWalletVault.walletInstance);
      const lightWallet = await new LightWalletConnector(
        {
          walletInstance,
          salt: lightWalletVault.salt,
        },
        {
          rpcUrl: "http://localhost:8545",
        },
      ).connect();

      await web3Manager.plugPersonalWallet(lightWallet);
      dispatch(obtainJwt);
      await usersApi.createLightwalletAccount(email, lightWalletVault.salt);
      //TODO: add error checking in case of failure
      // redirect user to dashboard
    },
    [
      DispatchSymbol,
      Web3ManagerSymbol,
      CreateLightWalletValueSymbol,
      StorageSymbol,
      VaultApiSymbol,
      UsersApiSymbol,
    ],
  );
