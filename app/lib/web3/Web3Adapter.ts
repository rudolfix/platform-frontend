import { BigNumber } from "bignumber.js";
import { promisify } from "bluebird";
import * as Web3 from "web3";

import { makeEthereumAddressChecksummed } from "../../modules/web3/utils";
import { EthereumAddress, EthereumAddressWithChecksum, EthereumNetworkId } from "../../types";
import { delay } from "../../utils/delay";

/**
 * Layer on top of raw Web3js. Simplifies API for common operations. Adds promise support.
 * Note that some methods may be not supported correctly by exact implementation of your client
 */
export class Web3Adapter {
  constructor(public readonly web3: Web3) {}

  public async getNetworkId(): Promise<EthereumNetworkId> {
    return promisify<string>(this.web3.version.getNetwork)() as any;
  }

  public async getBalance(address: string): Promise<BigNumber> {
    return promisify(this.web3.eth.getBalance)(address);
  }

  public async getAccountAddress(): Promise<EthereumAddress> {
    const getAccounts = promisify(this.web3.eth.getAccounts);
    const accounts = await getAccounts();
    return accounts[0] as EthereumAddress;
  }

  // returns mixed case checksummed ethereum address according to: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
  public async getAccountAddressWithChecksum(): Promise<EthereumAddressWithChecksum> {
    const address = await this.getAccountAddress();
    return makeEthereumAddressChecksummed(address);
  }

  public async ethSign(
    address: EthereumAddress | EthereumAddressWithChecksum,
    data: string,
  ): Promise<string> {
    const sign = promisify(this.web3.eth.sign);
    return sign(address, data);
  }

  public async signTypedData(
    address: EthereumAddress | EthereumAddressWithChecksum,
    data: ITypedDataToSign[],
  ): Promise<string> {
    const send = promisify<any, any>(
      this.web3.currentProvider.sendAsync.bind(this.web3.currentProvider),
    ); // web3 typings are not accurate here

    const resultData = await send({
      method: "eth_signTypedData",
      params: [data, address as string],
      from: address as string,
    });

    if (resultData.error !== undefined) {
      /*
       Sane thing is to throw Error but here result.error contain object with message and code fields.
       We could create own error but here it's gonna get more complicated when we will support more browser wallets as
       those have different API's and returned objects may differ
      */
      throw resultData.error;
    }

    return resultData.result;
  }

  public async sendTransaction(txData: Web3.TxData): Promise<string> {
    const send = promisify<any, any>(this.web3.eth.sendTransaction.bind(this.web3.eth));

    return await send(txData);
  }

  public async waitForTx(options: IWaitForTxOptions): Promise<Web3.Transaction> {
    const getTx = promisify(this.web3.eth.getTransaction);

    return new Promise<Web3.Transaction>((resolve, reject) => {
      this.watchNewBlock(async blockId => {
        try {
          await options.onNewBlock(blockId);

          const tx = await getTx(options.txHash);
          const isMined = tx && tx.blockNumber;

          if (!isMined) {
            return;
          }

          resolve(tx);

          return true;
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  // onNewBlock should return true to finish observing
  public async watchNewBlock(onNewBlock: (blockId: number) => Promise<boolean | void>) {
    let lastBlockId = -1;

    while (true) {
      const currentBlockNo = await this.getBlockNumber();
      if (lastBlockId !== currentBlockNo) {
        lastBlockId = currentBlockNo;

        const isFinished = await onNewBlock(lastBlockId);

        if (isFinished) {
          break;
        }
      }

      await delay(3000);
    }
  }

  public async getBlockNumber(): Promise<number> {
    const getBlockNumber = promisify(this.web3.eth.getBlockNumber);

    return getBlockNumber();
  }
}

interface IWaitForTxOptions {
  txHash: string;
  onNewBlock: (blockId: number) => Promise<void>;
}

interface ITypedDataToSign {
  type: string; // todo: here we could use more specific type. Something like "string" | "uint32" etc.
  name: string;
  value: string;
}
