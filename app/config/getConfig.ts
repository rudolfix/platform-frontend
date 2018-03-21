import { getRequiredEnv } from "./configUtils";

export interface IConfig {
  ethereumNetwork: {
    rpcUrl: string;
  };
  contractsAddresses: {
    universeContractAddress: string;
  };
}

export function getConfig(env: NodeJS.ProcessEnv): IConfig {
  return {
    ethereumNetwork: {
      rpcUrl: getRequiredEnv(env, "NF_RPC_PROVIDER"),
    },
    contractsAddresses: {
      universeContractAddress: getRequiredEnv(env, "NF_UNIVERSE_CONTRACT_ADDRESS"),
    },
  };
}
