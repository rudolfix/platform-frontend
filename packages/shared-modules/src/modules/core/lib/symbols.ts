import { createLibSymbol } from "../../../utils";
import { IHttpClient } from "./client/IHttpClient";
import { ILogger } from "./logger/ILogger";

export const symbols = {
  logger: createLibSymbol<ILogger>("logger"),
  backendRootUrl: createLibSymbol<string>("backendRootUrl"),
  binaryHttpClient: createLibSymbol<IHttpClient>("binaryHttpClient"),
};
