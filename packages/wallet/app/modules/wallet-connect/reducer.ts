import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { walletConnectActions } from "./actions";
import { TWalletConnectPeerWithConnectTimestamp } from "./types";

interface IWalletConnectState {
  connectedPeer: TWalletConnectPeerWithConnectTimestamp | undefined;
}

const initialState: IWalletConnectState = {
  connectedPeer: undefined,
};

const walletConnectReducer: AppReducer<IWalletConnectState, typeof walletConnectActions> = (
  state = initialState,
  action,
): DeepReadonly<IWalletConnectState> => {
  switch (action.type) {
    case walletConnectActions.connectedToPeer.getType():
      return {
        ...state,
        connectedPeer: action.payload.peer,
      };
    case walletConnectActions.disconnectedFromPeer.getType():
      return {
        ...state,
        connectedPeer: undefined,
      };
    default:
      return state;
  }
};

const walletConnectReducerMap = {
  walletConnect: walletConnectReducer,
};

export { walletConnectReducerMap };
