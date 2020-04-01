import { ILogger } from "@neufund/shared-modules";
import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import { ObjectStorage } from "./ObjectStorage";
import { Storage } from "./Storage";

export type TPeerMeta = {
  description:string,
  url:string,
  icons:string[],
  name:string
}

export type TStoredWalletConnectData = {
  connected:boolean,
  accounts:string[],
  chainId:number,
  bridge:string, //bridge url
  key:string,
  clientId:string,
  clientMeta:TPeerMeta,
  peerId:string,
  peerMeta:TPeerMeta,
  handshakeId:number,
  handshakeTopic:number
}

export const STORAGE_WALLET_CONNECT_KEY = "walletconnect";

@injectable()
export class WalletConnectStorage {
  private walletMetadataStorage: ObjectStorage<TStoredWalletConnectData>;

  constructor(
    @inject(symbols.storage) private readonly storage: Storage,
    @inject(symbols.logger) private readonly logger: ILogger,
  ) {
    this.walletMetadataStorage = new ObjectStorage<TStoredWalletConnectData>(
      this.storage,
      this.logger,
      STORAGE_WALLET_CONNECT_KEY,
    );
  }

  public get(): Promise<TStoredWalletConnectData | undefined> {
    return this.walletMetadataStorage.get();
  }

  public async clear(): Promise<void> {
    await this.walletMetadataStorage.clear();
  }
}
