import { TWalletMetadata } from "../../lib/persistence/WalletMetadataObjectStorage";
import { EthereumAddress } from "../../types";
import { createAction, createSimpleAction } from "../actionsUtils";

export const web3Actions = {
  personalWalletDisconnected: () => createSimpleAction("PERSONAL_WALLET_DISCONNECTED"),

  newPersonalWalletPlugged: (
    walletMetadata: TWalletMetadata,
    ethereumAddress: EthereumAddress,
    isUnlocked: boolean,
  ) => createAction("NEW_PERSONAL_WALLET_PLUGGED", { walletMetadata, ethereumAddress, isUnlocked }),

  walletUnlocked: () => createSimpleAction("WEB3_WALLET_UNLOCKED"),
  walletLocked: () => createSimpleAction("WEB3_WALLET_LOCKED"),
  loadPreviousWallet: (previousWallet: TWalletMetadata) =>
    createAction("LOAD_PREVIOUS_WALLET", previousWallet),
  loadSeedtoState: (seed: string) => createAction("WEB3_LOAD_SEED", seed),
  clearSeedFromState: () => createSimpleAction("WEB3_CLEAR_SEED"),
  fetchSeedFromWallet: () => createSimpleAction("WEB3_FETCH_SEED"),
};
