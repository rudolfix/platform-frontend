import { EthereumAddress } from "@neufund/shared";

import { TUnsignedTransaction } from "../eth/lib/types";

enum ESignerType {
  WC_SESSION_REQUEST = "wc_session_request",
  SIGN_MESSAGE = "sign_message",
  SEND_TRANSACTION = "send_transaction",
}

type TWCSessionRequestPayload = {
  peerId: string;
  peerName: string;
  peerUrl: string;
  id: number;
};

type TWCSessionResponsePayload = {
  address: EthereumAddress;
  chainId: number;
};

type TSignRequestPayload = {
  data: string;
};

type TSignResponsePayload = {
  signedData: string;
};

type TSendTransactionRequestPayload = {
  transaction: TUnsignedTransaction;
  id: string;
};

type TSendTransactionResponsePayload = {
  transactionHash: string;
  id: string;
};

export type TSignerRequestData = {
  [ESignerType.WC_SESSION_REQUEST]: TWCSessionRequestPayload;
  [ESignerType.SIGN_MESSAGE]: TSignRequestPayload;
  [ESignerType.SEND_TRANSACTION]: TSendTransactionRequestPayload;
};

export type TSignerResponseData = {
  [ESignerType.WC_SESSION_REQUEST]: TWCSessionResponsePayload;
  [ESignerType.SIGN_MESSAGE]: TSignResponsePayload;
  [ESignerType.SEND_TRANSACTION]: TSendTransactionResponsePayload;
};

export { ESignerType };
