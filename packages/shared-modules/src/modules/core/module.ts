import { generateSharedModuleId } from "../../utils";
import { setupContainerModule } from "./lib/bindings";
import { HttpClient } from "./lib/client/HttpClient";
import {
  IHttpClient,
  IHttpGetRequest,
  IHttpPostRequest,
  IHttpRequestCommon,
  IHttpResponse,
} from "./lib/client/IHttpClient";
import { JsonHttpClient } from "./lib/client/JsonHttpClient";
import { IEthManager } from "./lib/eth/IEthManager";
import { ESignerType } from "./lib/eth/types";
import { ILogger, noopLogger } from "./lib/logger";
import { ISingleKeyStorage } from "./lib/storage/ISingleKeyStorage";
import { symbols } from "./lib/symbols";

type TCoreModuleConfig = {
  backendRootUrl: string;
};

const MODULE_ID = generateSharedModuleId("core");

const setupCoreModule = (config: TCoreModuleConfig) => ({
  id: MODULE_ID,
  libs: [setupContainerModule(config.backendRootUrl)],
  api: coreModuleApi,
});

const coreModuleApi = {
  symbols,
  utils: {
    HttpClient,
  },
};

export {
  setupCoreModule,
  coreModuleApi,
  ILogger,
  noopLogger,
  IHttpClient,
  IHttpGetRequest,
  IHttpPostRequest,
  IHttpRequestCommon,
  IHttpResponse,
  ISingleKeyStorage,
  IEthManager,
  ESignerType,
  JsonHttpClient,
};
