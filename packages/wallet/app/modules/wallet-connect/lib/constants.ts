const walletConnectClientMeta = {
  // Required
  description: "Neufund App",
  url: "https://neufund.org",
  icons: ["https://walletconnect.org/walletconnect-logo.png"],
  name: "Neufund",
};

const WC_PROTOCOL = "wc";

const SESSION_REQUEST_EVENT = "session_request";
const SESSION_UPDATE_EVENT = "session_update";
const CALL_REQUEST_EVENT = "call_request";
const DISCONNECT_EVENT = "disconnect";
const CONNECT_EVENT = "connect";

const ETH_SIGN_RPC_METHOD = "eth_sign" as const;
const ETH_SEND_TYPED_TRANSACTION_RPC_METHOD = "eth_sendTypedTransaction" as const;

const WALLET_CONNECT_SESSION_KEY = "wallet-connect-session";

export {
  walletConnectClientMeta,
  WC_PROTOCOL,
  SESSION_REQUEST_EVENT,
  SESSION_UPDATE_EVENT,
  CALL_REQUEST_EVENT,
  DISCONNECT_EVENT,
  ETH_SIGN_RPC_METHOD,
  CONNECT_EVENT,
  ETH_SEND_TYPED_TRANSACTION_RPC_METHOD,
  WALLET_CONNECT_SESSION_KEY,
};
