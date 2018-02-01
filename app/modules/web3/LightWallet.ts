import { promisify } from "bluebird";
import * as LightWalletProvider from "eth-lightwallet";
// tslint:disable-next-line
import * as HookedWalletSubprovider from "web3-provider-engine/subproviders/hooked-wallet";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";

export async function deserializeLightWallet(
  serializedWallet: object,
  salt: string,
): Promise<void> {
  return await LightWalletProvider.keystore.deserialize(serializedWallet, salt);
}

interface ICreateLightWallet {
  password: string;
  hdPathString: string;
  recoverSeed: string | undefined;
  customSalt: string | undefined;
}
export async function createNewLightWallet({
  password,
  hdPathString,
  recoverSeed,
  customSalt,
}: ICreateLightWallet): Promise<{ walletInstance: any; salt: string }> {
  //if seed is provided wallet recovers same key
  const entropyStrength = 256;
  const seed = recoverSeed
    ? recoverSeed
    : LightWalletProvider.keystore.generateRandomSeed(undefined, entropyStrength);
  //salt strength taken from https://github.com/ConsenSys/eth-lightwallet/blob/master/lib/keystore.js#L107
  const salt = customSalt ? customSalt : LightWalletProvider.keystore.generateSalt(32);
  const create = promisify<any, any>(LightWalletProvider.keystore.createVault);
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

export async function getWalletKey(lightWalletInstance: any, password: string): Promise<void> {
  const keyFromPassword = promisify<any, string>(
    lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
  );
  return keyFromPassword(password);
}
