import { utils } from "ethers";
import isString from "lodash/fp/isString";

import { EthereumAddress, EthereumAddressWithChecksum } from "../opaque-types";

/**
 * Ellipsize Ethereum addresses
 * @param address
 */
export const trimAddress = (address: string) => `${address.slice(0, 10)}...${address.slice(-4)}`;

/**
 * Check if a given address is a valid
 *
 * @param address - A possible address
 */
export const isAddress = (address: unknown): address is EthereumAddress => {
  try {
    if (isString(address)) {
      utils.getAddress(address);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Check if a given address is a valid checksum address
 *
 * @param address - A possible address
 */
export const isChecksumAddress = (address: unknown): address is EthereumAddressWithChecksum => {
  try {
    return isString(address) && address === utils.getAddress(address);
  } catch {
    return false;
  }
};
