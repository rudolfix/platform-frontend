import { LightWalletUtil } from "../../../lib/web3/LightWallet";

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

export const lightWizardFlows = {};
// TODO: Remove this flow remove tests
