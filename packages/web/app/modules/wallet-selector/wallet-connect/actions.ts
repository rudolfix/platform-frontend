import { createActionFactory } from "../../../../../shared/dist/utils/actionsUtils";
import { TMessage } from "../../../components/translatedMessages/utils";

export const walletConnectActions = {
  walletConnectLogin: createActionFactory("WALLET_CONNECT_LOGIN"),
  walletConnectInit: createActionFactory("WALLET_CONNECT_INIT"),
  walletConnectStop: createActionFactory("WALLET_CONNECT_STOP"),
  walletConnectStart: createActionFactory("WALLET_CONNECT_START"),
  walletConnectSessionRequest: createActionFactory(
    "WALLET_CONNECT_SESSION_REQUEST",
    (uri:string) => ({uri})
  ),
  walletConnectReady: createActionFactory("WALLET_CONNECT_READY"),
  walletConnectDisconnected: createActionFactory("WALLET_CONNECT_DISCONNECTED"),
  walletConnectRejected: createActionFactory("WALLET_CONNECT_REJECTED"),
  walletConnectError: createActionFactory(
    "WALLET_CONNECT_ERROR",
    (error: TMessage) => ({error})
  ),
};
