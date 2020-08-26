import { isChecksumAddress } from "../../utils/addressUtils";
import { DevError } from "../../utils/errors";
import {
  EquityToken,
  EthereumAddress,
  EthereumAddressWithChecksum,
  EthereumHDMnemonic,
  EthereumHDPath,
  EthereumPrivateKey,
  EthereumTxHash,
} from "./types";

const toEquityTokenSymbol = (symbol: string) => symbol as EquityToken;

/**
 * @deprecated Prefer always checksum address for consistency (`toEthereumChecksumAddress` method).
 * @todo When we migrate to checksum address rename method to `toEthereumAddressNoChecksum` and `toEthereumChecksumAddress` to `toEthereumAddress`
 */
const toEthereumAddress = (address: string) => address as EthereumAddress;

const toEthereumChecksumAddress = (address: string) => {
  if (__DEV__ && !isChecksumAddress(address)) {
    throw new DevError("Address is not checksummed");
  }
  return address as EthereumAddressWithChecksum;
};

const toEthereumHDPath = (path: string) => path as EthereumHDPath;

const toEthereumPrivateKey = (privateKey: string) => privateKey as EthereumPrivateKey;

const toEthereumHDMnemonic = (mnemonic: string) => mnemonic as EthereumHDMnemonic;

const toEthereumTxHash = (txHash: string) => txHash as EthereumTxHash;

export {
  toEquityTokenSymbol,
  toEthereumAddress,
  toEthereumHDPath,
  toEthereumPrivateKey,
  toEthereumHDMnemonic,
  toEthereumChecksumAddress,
  toEthereumTxHash,
};
