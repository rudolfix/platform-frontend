import { ESignerType } from "../../../../../shared-modules/dist/modules/core/lib/eth/types";
import {
  WC_DEFAULT_SESSION_REQUEST_TIMEOUT,
  WC_DEFAULT_SIGN_TIMEOUT,
} from "../../../config/constants";
import { EWalletSubType, TWcWalletSubtypes } from "../../../modules/web3/types";
import { TPeerMeta } from "../../persistence/WalletConnectStorage";
import { ESignTransactionMethod } from "../types";

export type TWcMeta = {
  walletSubType: TWcWalletSubtypes;
  sendTransactionMethod: ESignTransactionMethod;
  signerType: ESignerType;
  sessionRequestTimeout: number;
  signingTimeout: number;
  supportsExplicitTimeouts: boolean;
  supportSessionPings: boolean;
  supportsRemoteKyc: boolean;
  supportsWalletMigration: boolean;
};

export const generateWalletMetaFormPeerMeta = (peerMeta: TPeerMeta | null): TWcMeta => {
  const walletMeta = {
    walletSubType: EWalletSubType.UNKNOWN as TWcWalletSubtypes,
    sendTransactionMethod: ESignTransactionMethod.ETH_SEND_TRANSACTION,
    signerType: ESignerType.ETH_SIGN,
    signingTimeout: WC_DEFAULT_SIGN_TIMEOUT,
    sessionRequestTimeout: WC_DEFAULT_SESSION_REQUEST_TIMEOUT,
    supportsExplicitTimeouts: false,
    supportSessionPings: false,
    supportsRemoteKyc: false,
    supportsWalletMigration: false,
  };

  if (peerMeta !== null && peerMeta.name === "Metamask") {
    //Todo find out what's the exact name for metamask.
    walletMeta.walletSubType = EWalletSubType.METAMASK;
    walletMeta.signerType = ESignerType.ETH_SIGN_TYPED_DATA;
  } else if (peerMeta !== null && peerMeta.name === "Neufund") {
    walletMeta.walletSubType = EWalletSubType.NEUFUND;
    walletMeta.supportsExplicitTimeouts = true;
    walletMeta.supportSessionPings = true;
    walletMeta.supportsRemoteKyc = true;
    walletMeta.supportsWalletMigration = true;
  }

  return walletMeta;
};
