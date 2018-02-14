import { promisify } from "bluebird";
import * as LightWalletProvider from "eth-lightwallet";
import * as ethUtils from "ethereumjs-util";
import { inject, injectable, LazyServiceIdentifer } from "inversify";
import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
// tslint:disable-next-line
import * as HookedWalletSubprovider from "web3-provider-engine/subproviders/hooked-wallet";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";
import { IPersonalWallet, SignerType, WalletSubType, WalletType } from "./PersonalWeb3";
import { IEthereumNetworkConfig, IEthereumNetworkConfigSymbol } from "./Web3Manager";

import { EthereumAddress } from "../../types";
import { Web3Adapter } from "./Web3Adapter";

export interface ICreateVault {
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

export const LightWalletUtilSymbol = "LightWalletUtilSymbol";

@injectable()
export class LightWalletUtil {
  public async deserializeLightWalletVault(
    serializedWallet: string,
    salt: string,
  ): Promise<ILightWallet> {
    return await LightWalletProvider.keystore.deserialize(serializedWallet, salt);
  }

  public async createLightWalletVault({
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
    const unlockedWallet = await LightWalletUtil.getWalletKey(lightWalletInstance, password);
    lightWalletInstance.generateNewAddress(unlockedWallet, 1);
    return { walletInstance: await lightWalletInstance.serialize(), salt };
  }

  static async getWalletKey(lightWalletInstance: any, password: string): Promise<object> {
    const keyFromPassword = promisify<ILightWallet, string>(
      lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
    );
    return await keyFromPassword(password);
  }

  public addPrefixToAddress(address: string): string {
    return "0x".concat(address);
  }
}

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
      this.password = "password";
    }
    const rawSignedMsg = await LightWalletProvider.signing.signMsg(
      this.vault.walletInstance,
      await LightWalletUtil.getWalletKey(this.vault.walletInstance, this.password),
      data,
      this.ethereumAddress,
    );
    // from signature parameters  to eth_sign RPC
    // @see https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#torpcsig
    return await ethUtils.toRpcSig(rawSignedMsg.v, rawSignedMsg.r, rawSignedMsg.s);
  }
}

export const LightWalletConnectorSymbol = "LightWalletConnector";

@injectable()
export class LightWalletConnector {
  private Web3Adapter?: any;
  public constructor(
    @inject(new LazyServiceIdentifer(() => IEthereumNetworkConfigSymbol))
    public readonly web3Config: IEthereumNetworkConfig,
  ) {}

  public readonly walletSubType: WalletSubType = WalletSubType.UNKNOWN;

  public async connect(
    lightWalletVault: IVault,
    walletAddress: EthereumAddress,
  ): Promise<IPersonalWallet> {
    try {
      this.Web3Adapter = new Web3Adapter(await this.setWeb3Provider(lightWalletVault));
      return new LightWallet(this.Web3Adapter, walletAddress, lightWalletVault);
    } catch (e) {
      if (e instanceof LightWalletError) {
        throw e;
      } else {
        throw new LightUnknownError();
      }
    }
  }

  private async setWeb3Provider(lightWalletVault: IVault): Promise<any> {
    let engine: any;
    try {
      // hooked-wallet-subprovider required methods were manually implemented
      const web3Provider = new HookedWalletSubprovider({
        signTransaction: lightWalletVault.walletInstance.signTransaction.bind(
          lightWalletVault.walletInstance,
        ),
        getAccounts: (cb: any) => {
          const data = lightWalletVault.walletInstance.getAddresses.bind(
            lightWalletVault.walletInstance,
          )();
          cb(undefined, data);
        },
      });
      engine = new Web3ProviderEngine();
      engine.addProvider(web3Provider);
      engine.addProvider(
        new RpcSubprovider({
          rpcUrl: this.web3Config.rpcUrl,
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
}

//TODO: wrap all errors generated from library into lightwallet class
