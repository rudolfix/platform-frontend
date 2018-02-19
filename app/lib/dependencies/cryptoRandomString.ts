import cryptoRandomStringModule = require("crypto-random-string");

export type CryptoRandomString = (length: number) => string;

export const cryptoRandomString: CryptoRandomString = cryptoRandomStringModule;
