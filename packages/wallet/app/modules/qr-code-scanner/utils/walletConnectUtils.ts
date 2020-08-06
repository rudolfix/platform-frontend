import { IParseURIResult, IQueryParamsResult, IRequiredParamsResult } from "@walletconnect/types";
import { parseQueryString } from "@walletconnect/utils";

import { WC_PROTOCOL } from "modules/qr-code-scanner/constants";
import { TWalletConnectUri } from "modules/wallet-connect/lib/types";

class InvalidWalletConnectUriError extends Error {
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

export { InvalidWalletConnectUriError, parseWalletConnectUri, isValidWalletConnectUri };
