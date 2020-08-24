import { assertType, AssertEqual } from "@neufund/shared-utils/tests";
import * as yup from "yup";

import { tupleSchema } from "utils/yupSchemas";

import { SESSION_REQUEST_EVENT } from "./constants";
import { getJSONRPCSchema } from "./schemas";

type YupPrimitiveInfer<T> = T extends yup.Schema<infer T> ? T : never;

describe("schemas", () => {
  describe("getJSONRPCSchema", () => {
    it("should properly validate json rpc types", () => {
      type ExpectedType = {
        id: number;
        jsonrpc: string;
        method: typeof SESSION_REQUEST_EVENT;
        params: [string, number];
      };

      const value: ExpectedType = {
        id: 1,
        jsonrpc: "2.0",
        method: SESSION_REQUEST_EVENT,
        params: ["foo", 100],
      };

      const WalletConnectSessionJSONRPCSchema = getJSONRPCSchema(
        SESSION_REQUEST_EVENT,
        tupleSchema([yup.string(), yup.number()]).required(),
      );

      // assert proper type inference
      type Type = YupPrimitiveInfer<typeof WalletConnectSessionJSONRPCSchema>;
      assertType<AssertEqual<Type, ExpectedType>>(true);

      expect(WalletConnectSessionJSONRPCSchema.isValidSync(value)).toBeTruthy();

      expect(WalletConnectSessionJSONRPCSchema.isValidSync(undefined)).toBeFalsy();
      expect(WalletConnectSessionJSONRPCSchema.isValidSync(null)).toBeFalsy();
      expect(WalletConnectSessionJSONRPCSchema.isValidSync({})).toBeFalsy();

      expect(
        WalletConnectSessionJSONRPCSchema.isValidSync({
          id: 1,
          jsonrpc: "2.0",
          method: SESSION_REQUEST_EVENT,
        }),
      ).toBeFalsy();
      expect(
        WalletConnectSessionJSONRPCSchema.isValidSync({
          id: 1,
          jsonrpc: "2.0",
          method: SESSION_REQUEST_EVENT,
          params: [100, "foo"],
        }),
      ).toBeFalsy();
    });
  });
});
