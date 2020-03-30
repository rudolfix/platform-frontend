import BigNumber from "bignumber.js";

export interface ITxData {
  to: string;
  value: string;
  data?: string;
  from: string;
  input?: string;
  gas: string;
  gasPrice: string;
}

export interface IRawTxData extends ITxData {
  nonce: string;
}

export interface IEthereumNetworkConfig {
  rpcUrl: string;
  backendRpcUrl: string;
}

export type TBigNumberVariants = string | BigNumber;

/**
 * Generates a dictionary with `T` values and `R` keys (default string)
 */
export type Dictionary<T, R extends string | number | symbol = string> = Record<R, T>;

/**
 * Generates a dictionary with `T` values and `R` keys (default string) where all properties are marked as partial
 */
export type PartialDictionary<T, R extends string | number | symbol = string> = Partial<
  Dictionary<T, R>
>;

export type TDictionaryValues<T> = T extends Dictionary<infer U> ? U : never;
export type TDictionaryArrayValues<T> = T extends Array<Dictionary<infer U>> ? U : never;

export type Primitive = string | number | boolean | undefined | null;

/**
 * Types allowed to keep as writable
 */
type WhitelistedWritableTypes = Date | BigNumber;
export type DeepReadonly<T> = T extends Primitive | WhitelistedWritableTypes
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<U>
  : T extends Function
  ? T
  : DeepReadonlyObject<T>;

export type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };

export type DeepWritable<T> = T extends Primitive | WhitelistedWritableTypes | Function
  ? T
  : T extends any[] | ReadonlyArray<any>
  ? IWritableArray<T[number]>
  : DeepWritableObject<T>;
type DeepWritableObject<T> = { -readonly [P in keyof T]: DeepWritable<T[P]> };
interface IWritableArray<T> extends Array<DeepWritable<T>> {}

export type TDataTestId = {
  "data-test-id"?: string;
};

/**
 * Allows either T or T[]
 */
export type TSingleOrArray<T> = T | T[];

/**
 * Forces an array to have at least one member of a given type T
 */
export type ArrayWithAtLeastOneMember<T> = [T, ...T[]];

/**
 * From T, omit a set of properties whose keys are in the union K
 * @example OmitKeys<{ foo: boolean, bar: string }, "foo"> // { bar: string }
 */
export type OmitKeys<T, K> = Pick<T, Exclude<keyof T, K>>;

/**
 * From T, omit a set of properties from K
 * @example OmitKeys<{ foo: boolean, bar: string }, { foo: boolean, }> // { bar: string }
 */
export type Omit<T, K> = OmitKeys<T, keyof K>;

/**
 * Make all properties in T required and non nullable
 */
export type RequiredNonNullable<T> = { [P in keyof T]-?: NonNullable<T[P]> };

/**
 * In T, mark as required and non nullable properties from K
 * Useful for types narrowing after recompose `branch` method
 * @example
 * RequiredByKeys<{ foo?: boolean | null, bar?: string }, "foo"> // { foo: boolean, bar?: string }
 */
export type RequiredByKeys<T, K extends keyof T> = RequiredNonNullable<Pick<T, K>> & OmitKeys<T, K>;

/**
 * In T, mark as partial properties from K
 * @example
 * PartialByKeys<{ foo: boolean, bar: string }, "foo"> // { foo?: boolean, bar: string }
 */
export type PartialByKeys<T, K extends keyof T> = Partial<Pick<T, K>> & OmitKeys<T, K>;

/**
 * Overwrites properties from T1 with one from T2
 * @example
 * Overwrite<{ foo: boolean, bar: string }, { foo: number }> // { foo: number, bar: string }
 */
export type Overwrite<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]: T1[P] } & T2;

/**
 * Change the type of all properties from U in T to `never` and `undefined`
 * @example
 * Without<{ foo: boolean, bar: string }, { foo: boolean }> // { foo?: never }
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * Makes union exclusive. Useful in situations when only single prop can be provided at the same time
 * @example
 * XOR<{ foo: boolean}, { bar: number }> // { foo: boolean, bar?: never } | { foo?: never, bar: number }
 */
export type XOR<T extends object, U extends object> = (Without<T, U> & U) | (Without<U, T> & T);

/**
 * Get object value types
 * @example
 * ValueOf<{ foo: boolean, bar: string }> // boolean | string
 */
export type Values<T> = T[keyof T];

/**
 * From T, select a union of property names which values extends R
 * @example
 * SelectPropertyNames<{ foo: boolean, bar: string, baz: string }, string> // "bar" | "baz"
 */
export type SelectPropertyNames<T, R> = { [K in keyof T]: T[K] extends R ? K : never }[keyof T];

/**
 * Stricter version of build in ReturnType. When T is not a function returns never
 * @example
 * ReturnTypeStrict<{}> // never
 * ReturnTypeStrict<() => string> // string
 */
export type ReturnTypeStrict<T> = T extends (...args: any) => infer R ? R : never;

/**
 * Forces a tuple type over array
 * @example
 * Tuple<[string, number]> // [string, number]
 */
export type Tuple<T = any> = [T] | T[];
