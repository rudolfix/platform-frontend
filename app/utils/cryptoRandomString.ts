import cryptoRandomStringModule = require("crypto-random-string");

export const CryptoRandomStringSymbol = "CryptoRandomStringSymbol";
export type CryptoRandomString = (length: number) => string;

export const cryptoRandomString: CryptoRandomString = cryptoRandomStringModule;
