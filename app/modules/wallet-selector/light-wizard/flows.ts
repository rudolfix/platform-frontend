import { GetState } from "../../../di/setupBindings";
import { symbols } from "../../../di/symbols";
import { VaultApi } from "../../../lib/api/vault/VaultApi";
import { ILogger } from "../../../lib/dependencies/Logger";
import { ObjectStorage } from "../../../lib/persistence/ObjectStorage";
import { TWalletMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import { LightWalletConnector, LightWalletUtil } from "../../../lib/web3/LightWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { injectableFn } from "../../../middlewares/redux-injectify";
import { AppDispatch } from "../../../store";
import { actions } from "../../actions";
import { selectUrlUserType } from "../selectors";
import { mapLightWalletErrorToErrorMessage } from "./errors";

//Vault nonce should be exactly 24 chars
const VAULT_MSG = "pleaseallowmetointroducemyselfim";
const GENERATED_KEY_SIZE = 56;

export async function getVaultKey(
  lightWalletUtil: LightWalletUtil,
  salt: string,
  password: string,
): Promise<string> {
  const walletKey = await lightWalletUtil.getWalletKeyFromSaltAndPassword(
    password,
    salt,
    GENERATED_KEY_SIZE,
  );
  return lightWalletUtil.encryptString({
    string: VAULT_MSG,
    pwDerivedKey: walletKey,
  });
}

export const lightWizardFlows = {
  tryConnectingWithLightWallet: (email: string, password: string, seed?: string) =>
    injectableFn(
      async (
        dispatch: AppDispatch,
        web3Manager: Web3Manager,
        lightWalletConnector: LightWalletConnector,
        lightWalletUtil: LightWalletUtil,
        walletMetadataStorage: ObjectStorage<TWalletMetadata>,
        vaultApi: VaultApi,
        logger: ILogger,
        getState: GetState,
      ) => {
        const userType = selectUrlUserType(getState().router);

        try {
          const lightWalletVault = await lightWalletUtil.createLightWalletVault({
            password,
            hdPathString: "m/44'/60'/0'",
            recoverSeed: seed,
          });

          const walletInstance = await lightWalletUtil.deserializeLightWalletVault(
            lightWalletVault.walletInstance,
            lightWalletVault.salt,
          );

          const vaultKey = await getVaultKey(lightWalletUtil, lightWalletVault.salt, password);
          await vaultApi.store(vaultKey, lightWalletVault.walletInstance);
          const lightWallet = await lightWalletConnector.connect(
            {
              walletInstance,
              salt: lightWalletVault.salt,
            },
            email,
            password,
          );
          walletMetadataStorage.set(lightWallet.getMetadata());
          await web3Manager.plugPersonalWallet(lightWallet);
          if (seed) dispatch(actions.routing.goToSuccessfulRecovery());
          else dispatch(actions.walletSelector.connected(userType));
        } catch (e) {
          logger.warn("Error while trying to connect with light wallet: ", e.message);
          dispatch(
            actions.genericModal.showErrorModal(
              "Light wallet Error",
              mapLightWalletErrorToErrorMessage(e),
            ),
          );
        }
      },
      [
        symbols.appDispatch,
        symbols.web3Manager,
        symbols.lightWalletConnector,
        symbols.lightWalletUtil,
        symbols.walletMetadataStorage,
        symbols.vaultApi,
        symbols.logger,
        symbols.getState,
      ],
    ),
};
