import * as cryptoRandomStringModule from "crypto-random-string";

export type CryptoRandomString = (length: number) => string;

export const cryptoRandomString: CryptoRandomString = cryptoRandomStringModule;
