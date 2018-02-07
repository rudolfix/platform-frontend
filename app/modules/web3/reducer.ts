import { createSelector } from "reselect";

import { AppReducer } from "../../store";
import { EthereumAddress } from "../../types";
import { WalletSubType, WalletType } from "./PersonalWeb3";
import { makeEthereumAddressChecksumed } from "./utils";

interface IDisconnectedWeb3State {
  connected: false;
  previousConnectedWalletType?: WalletType;
}

interface IConnectedWeb3State {
  connected: true;
  type: WalletType;
  subtype: WalletSubType;
  ethereumAddress: EthereumAddress;
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
        type: action.payload.type,
        subtype: action.payload.subtype,
        ethereumAddress: action.payload.ethereumAddress,
      };
    case "PERSONAL_WALLET_DISCONNECTED":
      return {
        connected: false,
        // try to capture previous wallet type to allow easier reestablishing connection etc.
        previousConnectedWalletType:
          (state as IDisconnectedWeb3State).previousConnectedWalletType ||
          (state as IConnectedWeb3State).type,
      };
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
  return makeEthereumAddressChecksumed(address);
});
