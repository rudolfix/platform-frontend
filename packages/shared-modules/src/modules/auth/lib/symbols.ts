import { createLibSymbol } from "../../../utils";
import { IEthManager, IHttpClient, ISingleKeyStorage } from "../../core/module";
import { SignatureAuthApi } from "./signature/SignatureAuthApi";
import { UsersApi } from "./users/UsersApi";

export const privateSymbols = {
  jwtTimingThreshold: createLibSymbol<number>("jwtTimingThreshold"),
  jwtRefreshThreshold: createLibSymbol<number>("jwtRefreshThreshold"),
};

export const symbols = {
  apiUserService: createLibSymbol<UsersApi>("apiUserService"),

  signatureAuthApi: createLibSymbol<SignatureAuthApi>("signatureAuthApi"),

  jwtStorage: createLibSymbol<ISingleKeyStorage<string>>("signatureAuthApi"),

  ethManager: createLibSymbol<IEthManager>("ethManager"),

  authJsonHttpClient: createLibSymbol<IHttpClient>("authJsonHttpClient"),

  authBinaryHttpClient: createLibSymbol<IHttpClient>("authBinaryHttpClient"),
};
