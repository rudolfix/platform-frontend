import { getRequiredEnv } from "./configUtils";

export interface IConfig {
  ethereumNetwork: {
    rpcUrl: string;
  };
  contractsAddresses: {
    euroTokenAddress: string;
    neumarkAddress: string;
  };
}

export function getConfig(env: NodeJS.ProcessEnv): IConfig {
  return {
    ethereumNetwork: {
      rpcUrl: getRequiredEnv(env, "NF_RPC_PROVIDER"),
    },
    contractsAddresses: {
      euroTokenAddress: getRequiredEnv(env, "NF_EURO_TOKEN_ADDRESS"),
      neumarkAddress: getRequiredEnv(env, "NF_NEUMARK_ADDRESS"),
    },
  };
}
