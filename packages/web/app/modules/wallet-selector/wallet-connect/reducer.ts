import { DeepReadonly } from "@neufund/shared-utils";

import { TMessage } from "../../../components/translatedMessages/utils";
import { AppReducer } from "../../../store";
import { actions } from "../../actions";

export interface IWalletConnectState {
  walletConnectError: DeepReadonly<TMessage> | undefined;
}

const walletConnectInitialState: IWalletConnectState = {
  walletConnectError: undefined,
};

export const walletConnectReducer: AppReducer<IWalletConnectState> = (
  state = walletConnectInitialState,
  action,
): IWalletConnectState => {
  switch (action.type) {
    case actions.walletSelector.walletConnectError.getType():
      return {
        walletConnectError: action.payload.error,
      };
  }

  return state;
};
