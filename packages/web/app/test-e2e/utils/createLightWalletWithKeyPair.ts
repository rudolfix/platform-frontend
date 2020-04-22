import { promisify } from "@neufund/shared-utils";
import * as LightWalletProvider from "eth-lightwallet";
import { toChecksumAddress } from "web3-utils";

import { DEFAULT_HD_PATH, DEFAULT_PASSWORD } from "./constants";

export const createLightWalletWithKeyPair = async (
  seed?: string,
  hdPathString: string = DEFAULT_HD_PATH,
) => {
  // promisify some stuff
  const create = promisify<any>(LightWalletProvider.keystore.createVault);
  // create a new wallet
  const entropyStrength = 256;
  seed = seed ? seed : LightWalletProvider.keystore.generateRandomSeed(undefined, entropyStrength);
  const salt = LightWalletProvider.keystore.generateSalt(32);
  const lightWalletInstance = await create({
    password: DEFAULT_PASSWORD,
    seedPhrase: seed,
    hdPathString,
    salt,
  });
  // create keypair
  const keyFromPassword = promisify<any>(
    lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
  );
  const walletKey: any = await keyFromPassword(DEFAULT_PASSWORD);
  lightWalletInstance.generateNewAddress(walletKey, 1);
  let address = lightWalletInstance.getAddresses()[0];
  address = toChecksumAddress(address);
  const privateKey = lightWalletInstance.exportPrivateKey(address, walletKey);
  return { lightWalletInstance, salt, address, privateKey, walletKey };
};
