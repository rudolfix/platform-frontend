import { createSelector } from "reselect";

import { TWalletMetadata } from "../../lib/persistence/WalletMetadataObjectStorage";
import { AppReducer } from "../../store";
import { EthereumAddress } from "../../types";
import { WalletType } from "./types";
import { makeEthereumAddressChecksummed } from "./utils";

export interface IDisconnectedWeb3State {
  connected: false;
  previousConnectedWallet?: TWalletMetadata;
}

export interface IConnectedWeb3State {
  connected: true;
  wallet: TWalletMetadata;
  ethereumAddress: EthereumAddress;
  isUnlocked: boolean; // this is important only for light wallet
}

export type IWeb3State = IDisconnectedWeb3State | IConnectedWeb3State;

export const web3InitialState: IWeb3State = {
  connected: false,
};

export const web3Reducer: AppReducer<IWeb3State> = (
  state = web3InitialState,
  action,
): IWeb3State => {
  switch (action.type) {
    case "NEW_PERSONAL_WALLET_PLUGGED":
      return {
        connected: true,
        wallet: action.payload.walletMetadata,
        ethereumAddress: action.payload.ethereumAddress,
        isUnlocked: action.payload.isUnlocked,
      };
    case "PERSONAL_WALLET_DISCONNECTED":
      return {
        connected: false,
        previousConnectedWallet: state.connected ? state.wallet : undefined,
      };
    case "WEB3_WALLET_UNLOCKED":
      if (state.connected) {
        return {
          ...state,
          isUnlocked: true,
        };
      } else {
        return state;
      }
    case "WEB3_WALLET_LOCKED":
      if (state.connected) {
        return {
          ...state,
          isUnlocked: false,
        };
      } else {
        return state;
      }
    case "LOAD_PREVIOUS_WALLET":
      if (!state.connected) {
        return {
          ...state,
          previousConnectedWallet: action.payload,
        };
      } else {
        return state;
      }
  }
  return state;
};

export const selectConnectedWeb3State = (state: IWeb3State): IConnectedWeb3State => {
  if (!state.connected) {
    throw Error("Wallet not connected");
  }
  return state;
};

export const selectEthereumAddress = (state: IWeb3State) =>
  selectConnectedWeb3State(state).ethereumAddress;

export const selectEthereumAddressWithChecksum = createSelector(selectEthereumAddress, address => {
  return makeEthereumAddressChecksummed(address);
});

export const selectIsLightWallet = (state: IWeb3State): boolean => {
  return state.connected && state.wallet.walletType === WalletType.LIGHT;
};

export const selectIsUnlocked = (state: IWeb3State): boolean => {
  return state.connected && state.isUnlocked;
};

export const isLightWalletReadyToLogin = (state: IWeb3State): boolean =>
  !!(
    !state.connected &&
    state.previousConnectedWallet &&
    state.previousConnectedWallet.walletType === WalletType.LIGHT &&
    state.previousConnectedWallet.email &&
    state.previousConnectedWallet.salt &&
    state.previousConnectedWallet.vault
  );
