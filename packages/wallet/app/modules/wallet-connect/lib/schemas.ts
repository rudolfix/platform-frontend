import { Tuple } from "@neufund/shared-utils";
import { utils } from "ethers";
import * as yup from "yup";

import { walletEthModuleApi } from "modules/eth/module";
import { StorageSchema } from "modules/storage";
import {
  ETH_SEND_TYPED_TRANSACTION_RPC_METHOD,
  ETH_SIGN_RPC_METHOD,
  SESSION_REQUEST_EVENT,
} from "modules/wallet-connect/lib/constants";

import { singleValue, tupleSchema } from "utils/yupSchemas";

export const getJSONRPCSchema = <T extends string, U extends Tuple>(
  method: T,
  params: yup.Schema<U>,
) =>
  // We need to manually provide generics here otherwise typescript is not able to automatically
  // resolve T and U to a proper types (they are kept as generic values and we loose type-safety)
  yup.object<{
    id: number;
    jsonrpc: string;
    method: T;
    params: U;
  }>({
    id: yup.number().required(),
    jsonrpc: yup.string().required(),
    method: singleValue(method).required(),
    params,
  });

//================================================================================
// Session Schema
//================================================================================

const SessionPeerMetaSchema = yup.object({
  description: yup.string(),
  url: yup.string().required(),
  icons: yup.array(yup.string().required()),
  name: yup.string().required(),
});

const SessionPeerSchema = yup.object({
  peerId: yup.string().required(),
  peerMeta: SessionPeerMetaSchema.required(),
});

export type TPeerMeta = yup.InferType<typeof SessionPeerMetaSchema>;

export const WalletConnectSessionJSONRPCSchema = getJSONRPCSchema(
  SESSION_REQUEST_EVENT,
  tupleSchema([SessionPeerSchema.required()]).required(),
);

//================================================================================
// EthSign Schema
//================================================================================

const HexStringSchema = yup
  .string()
  // eslint-disable-next-line no-template-curly-in-string
  .test("is-hex-string", "${path} is not hex string", value => utils.isHexString(value));

export const WalletConnectEthSignJSONRPCSchema = getJSONRPCSchema(
  ETH_SIGN_RPC_METHOD,
  tupleSchema([
    walletEthModuleApi.utils.ethereumAddress().required(),
    HexStringSchema.required(),
  ]).required(),
);

const TransactionSchema = yup
  .object({
    to: walletEthModuleApi.utils.ethereumAddress().required(),
    gasPrice: yup.string().required(),
    gasLimit: yup.string().required(),
    value: yup.string().required(),
    data: yup.string().required(),
  })
  // rename `gas` to `gasLimit` because ethers expects `gasLimit` and transaction payload comes with `gas`
  .from("gas", "gasLimit");

const TransactionMetaDataSchema = yup.object({
  transactionType: yup.string().required(),
  // TODO update after transactionAdditionalData is structured
  transactionAdditionalData: yup.object(),
});

export type TTransactionSchema = yup.InferType<typeof TransactionSchema>;
export type TTransactionMetaData = yup.InferType<typeof TransactionMetaDataSchema>;

export const WalletConnectEthSendTypedTransactionJSONRPCSchema = getJSONRPCSchema(
  ETH_SEND_TYPED_TRANSACTION_RPC_METHOD,
  tupleSchema([TransactionSchema.required(), TransactionMetaDataSchema.required()]).required(),
);

//================================================================================
// SessionStorage Schema
//================================================================================

const WalletSessionSchema = yup.object({
  connected: yup.boolean().required(),
  accounts: yup.array(yup.string().required()).required(),
  chainId: yup.number().required(),
  bridge: yup.string().required(),
  key: yup.string().required(),
  clientId: yup.string().required(),
  clientMeta: SessionPeerMetaSchema.nullable(),
  peerId: yup.string().required(),
  peerMeta: SessionPeerMetaSchema.nullable(),
  handshakeId: yup.number().required(),
  handshakeTopic: yup.string().required(),
});

export type TWalletSession = yup.InferType<typeof WalletSessionSchema>;

export const WalletSessionStorageSchema = new StorageSchema<TWalletSession>(
  1,
  "WalletSessionSchema",
  WalletSessionSchema,
);

//================================================================================
// Digest Schema
//================================================================================

export const DigestJSONSchema = yup.object({
  permissions: yup.array(yup.string().required()).required(),
});

export type TDigestJSON = yup.InferType<typeof DigestJSONSchema>;
