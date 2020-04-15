import { DeepReadonly } from "@neufund/shared";
import { AppReducer } from "@neufund/sagas";

import { walletConnectActions } from "./actions";
import { TWalletConnectPeer } from "./types";

interface IWalletConnectState {
  connectedPeer: TWalletConnectPeer | undefined;
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

export { walletConnectReducer };
