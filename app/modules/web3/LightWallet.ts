import { promisify } from "bluebird";
import * as LightWalletProvider from "eth-lightwallet";
import { injectable } from "inversify";
import * as Web3 from "web3";
import { IPersonalWallet, SignerType, WalletSubType, WalletType } from "./PersonalWeb3";
import { IEthereumNetworkConfig } from "./Web3Manager";

import * as Web3ProviderEngine from "web3-provider-engine";
// tslint:disable-next-line
import * as HookedWalletSubprovider from "web3-provider-engine/subproviders/hooked-wallet";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";

import { EthereumAddress } from "../../types";
import { Web3Adapter } from "./Web3Adapter";

interface ICreateVault {
  password: string;
  hdPathString: string;
  recoverSeed?: string | undefined;
  customSalt?: string | undefined;
}

export interface IVault {
  walletInstance: any;
  salt: string;
}

export interface ILightWallet {
  addresses: Array<string>;
  encHdRootPriv: object;
  encPrivKeys: object;
  encSeed: object;
  hdIndex: number;
  hdPathString: string;
  salt: string;
  version: number;
  getSeed: (walletKey: object) => string;
  signTransaction: (txParams: object) => void;
  getAddresses: () => Array<string>;
}

export class LightWalletError extends Error {}
export class LightWalletWrongPassword extends LightWalletError {}
export class LightWalletMissingError extends LightWalletError {}
export class LightUnknownError extends LightWalletError {}

export class LightWallet implements IPersonalWallet {
  constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly ethereumAddress: EthereumAddress,
    private vault: IVault,
  ) {}
  public readonly walletType = WalletType.LIGHT;
  public readonly walletSubType = WalletSubType.UNKNOWN;
  public readonly signerType = SignerType.ETH_SIGN;

  private password?: string;

  public async testConnection(networkId: string): Promise<boolean> {
    const currentNetworkId = await this.web3Adapter.getNetworkId();
    if (currentNetworkId !== networkId) {
      return false;
    }

    return !!await this.web3Adapter.getAccountAddress();
  }

  public async signMessage(data: string): Promise<string> {
    if (!this.password) {
      //TODO: implement password prompt and password timer
      //Will only currently if Vault Password is Password
      this.password = "password";
    }
    return LightWalletProvider.signing.signMsg(
      this.vault.walletInstance,
      await getWalletKey(this.vault.walletInstance, this.password),
      data,
      this.ethereumAddress,
    );
  }
}

export const LightWalletConnectorSymbol = "LightWalletConnector";

@injectable()
export class LightWalletConnector {
  private Web3Adapter?: any;
  private lightWalletWeb3?: any;
  constructor(
    public readonly lightWalletVault: IVault,
    public readonly walletSubType: WalletSubType,
    public readonly web3Config: IEthereumNetworkConfig,
  ) {}
  public async connect(): Promise<IPersonalWallet> {
    try {
      this.lightWalletWeb3 = await setWeb3Provider(
        this.lightWalletVault.walletInstance,
        this.web3Config.rpcUrl,
      );
      this.Web3Adapter = new Web3Adapter(this.lightWalletWeb3);
      return new LightWallet(
        this.Web3Adapter,
        this.lightWalletVault.walletInstance.addresses[0],
        this.lightWalletVault,
      );
    } catch (e) {
      if (e instanceof LightWalletError) {
        throw e;
      } else {
        throw new LightUnknownError();
      }
    }
  }
}

export async function setWeb3Provider(keystore: ILightWallet, rpcUrl: string): Promise<any> {
  let engine: any;
  try {
    // hooked-wallet-subprovider required methods were manually implemented
    const web3Provider = new HookedWalletSubprovider({
      signTransaction: keystore.signTransaction.bind(keystore),
      getAccounts: (cb: any) => {
        const data = keystore.getAddresses.bind(keystore)();
        cb(undefined, data);
      },
    });
    engine = new Web3ProviderEngine();
    engine.addProvider(web3Provider);
    engine.addProvider(
      new RpcSubprovider({
        rpcUrl,
      }),
    );
    engine.start();
    return new Web3(engine);
  } catch (e) {
    if (engine) {
      engine.stop();
    }
    throw e;
  }
}

export async function deserializeLightWalletVault(
  serializedWallet: string,
  salt: string,
): Promise<ILightWallet> {
  return await LightWalletProvider.keystore.deserialize(serializedWallet, salt);
}

export const CreateLightWalletValueSymbol = "createLightWalletVault";
export type CreateLightWalletVaultType = typeof createLightWalletVault;

export async function createLightWalletVault({
  password,
  hdPathString,
  recoverSeed,
  customSalt,
}: ICreateVault): Promise<IVault> {
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
  return { walletInstance: await lightWalletInstance.serialize(), salt };
}

export async function getWalletKey(lightWalletInstance: any, password: string): Promise<object> {
  const keyFromPassword = promisify<ILightWallet, string>(
    lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
  );
  return await keyFromPassword(password);
}

//TODO: wrap all errors generated from library into lightwallet class
