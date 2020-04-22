import { randomHex } from "web3-utils";

/**
 * A helper method that generates a private a random private key
 */
export const generateRandomPrivateKey = () => randomHex(32);
