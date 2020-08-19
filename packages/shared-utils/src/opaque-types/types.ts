/**
 * Opaque types can provide semantic information to simpler types like strings etc
 * see: https://codemix.com/opaque-types-in-javascript/
 */
export type Opaque<K, T> = T & { __TYPE__: K };
export type OpaqueType<O extends Opaque<any, any>> = O["__TYPE__"];
