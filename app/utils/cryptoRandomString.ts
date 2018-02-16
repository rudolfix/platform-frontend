import cryptoRandomStringModule = require("crypto-random-string");

export const CRYPTO_RANDOM_STRING_SYMBOL = Symbol();
export type CryptoRandomString = (length: number) => string;

export const cryptoRandomString: CryptoRandomString = cryptoRandomStringModule;
