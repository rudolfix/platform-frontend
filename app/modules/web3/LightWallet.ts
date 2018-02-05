import { promisify } from "bluebird";
import * as LightWalletProvider from "eth-lightwallet";
// tslint:disable-next-line
import * as HookedWalletSubprovider from "web3-provider-engine/subproviders/hooked-wallet";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";

interface ICreateLightWallet {
  password: string;
  hdPathString: string;
  recoverSeed?: string | undefined;
  customSalt?: string | undefined;
}

interface IVaultInstance {
  walletInstance: any;
  salt: string;
}

interface ILightWallet {
  addresses: Array<string>;
  encHdRootPriv: object;
  encPrivKeys: object;
  encSeed: object;
  hdIndex: number;
  hdPathString: string;
  salt: string;
  version: number;
  getSeed: any;
  __proto__: object;
}
export async function deserializeLightWallet(
  serializedWallet: string,
  salt: string,
): Promise<ILightWallet> {
  return await LightWalletProvider.keystore.deserialize(serializedWallet, salt);
}

export async function createNewLightWallet({
  password,
  hdPathString,
  recoverSeed,
  customSalt,
}: ICreateLightWallet): Promise<IVaultInstance> {
  const create = promisify<any, object>(LightWalletProvider.keystore.createVault);
  //256bit strength generates a 24 word mnemonic
  const entropyStrength = 256;
  const seed = recoverSeed
    ? recoverSeed
    : LightWalletProvider.keystore.generateRandomSeed(undefined, entropyStrength);
  //salt strength should be 32 bit. see https://github.com/ConsenSys/eth-lightwallet/blob/master/lib/keystore.js#L107
  const salt = customSalt ? customSalt : LightWalletProvider.keystore.generateSalt(32);
  const lightWalletInstance = await create({
    password,
    seedPhrase: seed,
    hdPathString,
    salt,
  });
  const unlockedWallet = await getWalletKey(lightWalletInstance, password);
  lightWalletInstance.generateNewAddress(unlockedWallet, 1);
  return { walletInstance: await lightWalletInstance.serialize(), salt: salt };
}

export async function getWalletKey(lightWalletInstance: any, password: string): Promise<object> {
  const keyFromPassword = promisify<any, string>(
    lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
  );
  return await keyFromPassword(password);
}
//TODO: wrap all errors generated from library into lightwallet.ts
