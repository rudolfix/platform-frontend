import { Opaque } from "../types";

export type EthereumNetworkId = Opaque<"EthereumNetworkId", string>;
export type EthereumTxHash = Opaque<"EthereumTxHash", string>;
export type EthereumAddress = Opaque<"EthereumAddress", string>;
/**
 * Represents ENS domain name
 */
export type EthereumName = Opaque<"EthereumName", string>;
export type EthereumPrivateKey = Opaque<"EthereumPrivateKey", string>;
export type EthereumHDMnemonic = Opaque<"EthereumHDMnemonic", string>;
export type EthereumHDPath = Opaque<"EthereumHDPath", string>;
export type EthereumAddressWithChecksum = Opaque<"EthereumAddressWithChecksum", string>;
export type EquityToken = Opaque<"EquityToken", string>;
