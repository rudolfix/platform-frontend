import { UnknownObject } from "@neufund/shared-utils";
import { IRequiredParamsResult, IQueryParamsResult, IParseURIResult } from "@walletconnect/types";
import { parseQueryString } from "@walletconnect/utils";
import { utils } from "ethers";
import * as yup from "yup";

import { WalletConnectModuleError } from "modules/wallet-connect/errors";
import { DigestJSONSchema } from "modules/wallet-connect/lib/schemas";

import { WC_PROTOCOL } from "./constants";
import { TWalletConnectUri } from "./types";

const toWalletConnectUri = (uri: string) => uri as TWalletConnectUri;

class InvalidWalletConnectUriError extends WalletConnectModuleError {
  constructor() {
    super("Invalid wallet connect uri received");
  }
}

const parseRequiredParams = (path: string): IRequiredParamsResult => {
  const values = path.split("@");

  return {
    handshakeTopic: values[0],
    version: parseInt(values[1], 10),
  };
};

const parseQueryParams = (queryString: string): IQueryParamsResult => {
  const result = parseQueryString(queryString) as IQueryParamsResult;

  return {
    key: result.key ?? "",
    bridge: result.bridge ? decodeURIComponent(result.bridge) : "",
  };
};

const parseWalletConnectUri = (uri: string): IParseURIResult => {
  const pathStart: number = uri.indexOf(":") + 1;
  const pathEnd: number = uri.includes("?") ? uri.indexOf("?") : uri.length;

  const protocol: string = uri.substring(0, pathStart - 1);

  if (protocol !== WC_PROTOCOL) {
    throw new InvalidWalletConnectUriError();
  }

  const path: string = uri.substring(pathStart, pathEnd);

  const requiredParams: IRequiredParamsResult = parseRequiredParams(path);

  if (!requiredParams.handshakeTopic || !requiredParams.version) {
    throw new InvalidWalletConnectUriError();
  }

  const queryString: string = typeof pathEnd !== "undefined" ? uri.substr(pathEnd) : "";

  const queryParams: IQueryParamsResult = parseQueryParams(queryString);

  if (!queryParams.bridge || !queryParams.key) {
    throw new InvalidWalletConnectUriError();
  }

  return {
    protocol,
    ...requiredParams,
    ...queryParams,
  };
};

const isValidWalletConnectUri = (uri: string): uri is TWalletConnectUri => {
  try {
    parseWalletConnectUri(uri);

    return true;
  } catch {
    return false;
  }
};

/**
 * Parses RPC payload
 * @note It's important to strip unknown properties given we don't fully control RPC payload shape
 * @throws An error when payload do not match schema
 */
const parseRPCPayload = <T extends UnknownObject>(schema: yup.ObjectSchema<T>, value: unknown) =>
  schema.validateSync(value, { stripUnknown: true });

/**
 * Parse hex string into JSON that should look like
 * {
 *   "address": "0xfA1Af2E251ee739F83e14d7daCfd77B3d0E930b7",
 *   "salt": "a6519493c1a27cbf2eab53188173eedcafca88c676d5e14b9813bb1acc2fd7fc",
 *   "permissions": ["sign-tos"],
 *   "timestamp": 1596534526,
 *   "signer_type": "eth_sign",
 *   "mac": "0x8cdd5a1e2acb03b871db3d5c54545fab0ad8be3b788951fea459de6fdac56d462c8b168133b92fd4559a3dc82a719847"
 * }
 * @param digest {string}
 * @throws An error when payload do not match schema
 */
const parseDigestString = (digest: string) => {
  const digestJSON = JSON.parse(utils.toUtf8String(digest)) as unknown;
  return DigestJSONSchema.validateSync(digestJSON, { stripUnknown: true });
};

export {
  toWalletConnectUri,
  isValidWalletConnectUri,
  parseWalletConnectUri,
  InvalidWalletConnectUriError,
  parseRPCPayload,
  parseDigestString,
};
