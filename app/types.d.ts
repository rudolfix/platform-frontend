type Dictionary<T> = { [id: string]: T };

type AsInterface<T> = { [K in keyof T]: T[K] };

// opaque types can provide semantic information to simpler types like strings etc
// read: https://codemix.com/opaque-types-in-javascript/
type Opaque<K, T> = T & { __TYPE__: K };

export type EthereumNetworkId = Opaque<"EthereumNetworkId", string>;
export type EthereumAddress = Opaque<"EthereumAddress", string>;
export type EthereumAddressWithChecksum = Opaque<"EthereumAddressWithChecksum", string>;

type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
