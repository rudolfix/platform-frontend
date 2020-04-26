import {
  EquityToken,
  EthereumAddress,
  EthereumHDMnemonic,
  EthereumHDPath,
  EthereumPrivateKey,
} from "./types";

const toEquityTokenSymbol = (symbol: string) => symbol as EquityToken;

const toEthereumAddress = (address: string) => address as EthereumAddress;

const toEthereumHDPath = (path: string) => path as EthereumHDPath;

const toEthereumPrivateKey = (privateKey: string) => privateKey as EthereumPrivateKey;

const toEthereumHDMnemonic = (mnemonic: string) => mnemonic as EthereumHDMnemonic;

export {
  toEquityTokenSymbol,
  toEthereumAddress,
  toEthereumHDPath,
  toEthereumPrivateKey,
  toEthereumHDMnemonic,
};
