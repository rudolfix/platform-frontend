import { createLibSymbol } from "../../../utils";
import { IEthManager, IHttpClient, ISingleKeyStorage } from "../../core/module";
import { SignatureAuthApi } from "./SignatureAuthApi";

export const symbols = {
  signatureAuthApi: createLibSymbol<SignatureAuthApi>("signatureAuthApi"),

  jwtStorage: createLibSymbol<ISingleKeyStorage<string>>("signatureAuthApi"),

  ethManager: createLibSymbol<IEthManager>("ethManager"),

  authJsonHttpClient: createLibSymbol<IHttpClient>("authJsonHttpClient"),

  authBinaryHttpClient: createLibSymbol<IHttpClient>("authBinaryHttpClient"),
};
