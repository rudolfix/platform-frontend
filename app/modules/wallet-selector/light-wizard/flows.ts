import { symbols } from "../../../di/symbols";
import { VaultApi } from "../../../lib/api/vault/VaultApi";
import { ILogger } from "../../../lib/dependencies/Logger";
import { LightWalletConnector, LightWalletUtil } from "../../../lib/web3/LightWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { injectableFn } from "../../../middlewares/redux-injectify";
import { AppDispatch } from "../../../store";
import { actions } from "../../actions";
import { mapLightWalletErrorToErrorMessage } from "./errors";

//Vault nonce should be exactly 24 chars
const VAULT_MSG = "pleaseallowmetointroducemyselfim";
const GENERATED_KEY_SIZE = 56;
export const DEFAULT_HD_PATH = "m/44'/60'/0'";

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
  tryConnectingWithLightWallet: (email: string, password: string) =>
    injectableFn(
      async (
        dispatch: AppDispatch,
        web3Manager: Web3Manager,
        lightWalletConnector: LightWalletConnector,
        lightWalletUtil: LightWalletUtil,
        vaultApi: VaultApi,
        logger: ILogger,
      ) => {
        try {
          const lightWalletVault = await lightWalletUtil.createLightWalletVault({
            password,
            hdPathString: DEFAULT_HD_PATH,
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

          await web3Manager.plugPersonalWallet(lightWallet);
          dispatch(actions.walletSelector.connected());
        } catch (e) {
          logger.warn("Error while trying to connect with light wallet: ", e.message);
          //TODO: TRANSLATIONS
          dispatch(actions.genericModal.showErrorModal(mapLightWalletErrorToErrorMessage(e)));
        }
      },
      [
        symbols.appDispatch,
        symbols.web3Manager,
        symbols.lightWalletConnector,
        symbols.lightWalletUtil,
        symbols.vaultApi,
        symbols.logger,
      ],
    ),
};
// TODO: Remove this flow remove tests
