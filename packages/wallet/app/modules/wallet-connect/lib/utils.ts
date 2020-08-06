import { UnknownObject } from "@neufund/shared-utils";
import * as yup from "yup";

import { TWalletConnectUri } from "./types";

const toWalletConnectUri = (uri: string) => uri as TWalletConnectUri;

/**
 * Parses RPC payload
 *
 * @note It's important to strip unknown properties given we don't fully control RPC payload shape
 *
 * @throws An error when payload do not match schema
 */
const parseRPCPayload = <T extends UnknownObject>(schema: yup.ObjectSchema<T>, value: unknown) =>
  schema.validateSync(value, { stripUnknown: true });

export { toWalletConnectUri, parseRPCPayload };
