import { EJurisdiction } from "@neufund/shared-modules";
import { withParams } from "@neufund/shared-utils";
import Config from "react-native-config";

/**
 * Returns the web app host based on pinned artifacts version
 */
export const getPlatformHost = () => {
  switch (Config.NF_CONTRACT_ARTIFACTS_VERSION) {
    case "localhost":
      return "https://platform.neufund.io";
    case "forked_live":
      return "https://platform.neufund.net";
    default:
      return "https://platform.neufund.org";
  }
};

const platformHost = getPlatformHost();

export const externalRoutes = {
  platformWalletConnect: `${platformHost}/wallet-connect`,
  etherscanTransaction: "https://etherscan.io/tx/:txHash",
  platformEto: `${platformHost}/eto/view/:jurisdiction/:previewCode`,
};

export const etherscanTxLink = (txHash: string) =>
  withParams(externalRoutes.etherscanTransaction, { txHash });

export const platformEtoLink = (previewCode: string, jurisdiction: EJurisdiction) =>
  withParams(externalRoutes.platformEto, { previewCode, jurisdiction });
