import { isGaslessTxEnabled } from "@neufund/shared-utils";

import { getRequiredEnv, verifyOptionalFlagEnv } from "./configUtils";

export interface IBackendRoot {
  url: string;
}
export interface IConfig {
  ethereumNetwork: {
    rpcUrl: string;
    backendRpcUrl: string;
    bridgeUrl: string;
  };
  contractsAddresses: {
    universeContractAddress: string;
  };
  externalResources: {
    etoStatisticsIframeURL: string;
  };
  backendRoot: IBackendRoot;
  isMochaRunning?: boolean;
}

export function getConfig(): IConfig {
  verifyFeatureFlags();

  return {
    ethereumNetwork: {
      rpcUrl: getRequiredEnv(process.env.NF_RPC_PROVIDER, "NF_RPC_PROVIDER"),
      // Falls back to the regular settings when NF_TRANSACTIONAL_RPC_PROVIDER is not provided
      backendRpcUrl: isGaslessTxEnabled
        ? getRequiredEnv(process.env.NF_TRANSACTIONAL_RPC_PROVIDER, "NF_TRANSACTIONAL_RPC_PROVIDER")
        : getRequiredEnv(process.env.NF_RPC_PROVIDER, "NF_RPC_PROVIDER"),
      bridgeUrl: getRequiredEnv(process.env.NF_BRIDGE_URL, "NF_BRIDGE_URL"),
    },
    contractsAddresses: {
      universeContractAddress: getRequiredEnv(
        process.env.NF_UNIVERSE_CONTRACT_ADDRESS,
        "NF_UNIVERSE_CONTRACT_ADDRESS",
      ),
    },
    externalResources: {
      etoStatisticsIframeURL: getRequiredEnv(process.env.NF_ETO_STATS_URL, "NF_ETO_STATS_URL"),
    },
    backendRoot: {
      url: process.env.NF_BACKEND_ROOT || "",
    },
  };
}

/**
 * We do not store feature flags inside the config. We just verify them here and they are accessed directly via process.env to allow easy build optimization.
 */
function verifyFeatureFlags(): void {
  verifyOptionalFlagEnv(
    process.env.NF_FEATURE_EMAIL_CHANGE_ENABLED,
    "NF_FEATURE_EMAIL_CHANGE_ENABLED",
  );
}
