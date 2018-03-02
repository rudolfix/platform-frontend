import { TWalletMetadata } from "../../lib/persistence/WalletMetadataObjectStorage";
import { EthereumAddress } from "../../types";
import { createAction, createSimpleAction } from "../actionsUtils";
import { WalletSubType, WalletType } from "./types";

export const web3Actions = {
  personalWalletDisconnected: () => createSimpleAction("PERSONAL_WALLET_DISCONNECTED"),

  newPersonalWalletPlugged: (
    type: WalletType,
    subtype: WalletSubType,
    ethereumAddress: EthereumAddress,
    isUnlocked: boolean,
  ) => createAction("NEW_PERSONAL_WALLET_PLUGGED", { type, subtype, ethereumAddress, isUnlocked }),

  walletUnlocked: () => createSimpleAction("WEB3_WALLET_UNLOCKED"),
  walletLocked: () => createSimpleAction("WEB3_WALLET_LOCKED"),
  loadPreviousWallet: (previousWallet: TWalletMetadata) =>
    createAction("LOAD_PREVIOUS_WALLET", previousWallet),
};
