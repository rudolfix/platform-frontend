import {
  EthereumPrivateKey,
  EthereumAddress,
  EthereumAddressWithChecksum,
  EthereumHDMnemonic,
} from "@neufund/shared";
import { utils } from "ethers";
import isString from "lodash/fp/isString";

import { THDWalletMetadata, TWalletMetadata } from "./schemas";
import { EWalletType } from "./types";

const addHexPrefix = (data: string) => {
  return data.startsWith("0x") ? data : "0x" + data;
};

/**
 * Check if a give wallet is an HDWallet
 *
 * @param wallet - A wallet (either privateKey or HD wallet)
 */
const isHdWallet = (wallet: TWalletMetadata): wallet is THDWalletMetadata =>
  wallet.type === EWalletType.HD_WALLET;

/**
 * Check if a given value is a valid private key
 *
 * @param privateKey - A possible private key
 */
const isPrivateKey = (privateKey: unknown): privateKey is EthereumPrivateKey => {
  return isString(privateKey) && !!privateKey.match(/^0x[0-9a-f]*$/i) && privateKey.length === 66;
};

/**
 * Check if a given value is a valid mnemonic
 * @note We only support 12 or 24 words mnemonics
 *
 * @param mnemonic - A possible mnemonic
 */
const isMnemonic = (mnemonic: unknown): mnemonic is EthereumHDMnemonic => {
  if (isString(mnemonic) && utils.HDNode.isValidMnemonic(mnemonic)) {
    const words = mnemonic.split(/\s/);

    return words.length === 12 || words.length === 24;
  }

  return false;
};

/**
 * Check if a given address is a valid
 *
 * @param address - A possible address
 */
const isAddress = (address: unknown): address is EthereumAddress => {
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
const isChecksumAddress = (address: unknown): address is EthereumAddressWithChecksum => {
  try {
    if (isString(address)) {
      const checksumAddress = utils.getAddress(address);

      return address === checksumAddress;
    }
  } catch {}

  return false;
};

export { isHdWallet, isPrivateKey, isMnemonic, isAddress, isChecksumAddress, addHexPrefix };
