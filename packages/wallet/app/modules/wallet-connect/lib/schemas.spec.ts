import { assertType, AssertEqual } from "@neufund/shared-utils/tests";
import * as yup from "yup";

import { tupleSchema } from "utils/yupSchemas";

import { SESSION_REQUEST_EVENT } from "./constants";
import { getJSONRPCSchema, WalletConnectEthSignJSONRPCSchema } from "./schemas";

type YupPrimitiveInfer<T> = T extends yup.Schema<infer T> ? T : never;

describe("Schemas & utils", () => {
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

  describe("Schemas", () => {
    it("WalletConnectEthSignJSONRPCSchema", () => {
      const ethereumAddress = "0xfA1Af2E251ee739F83e14d7daCfd77B3d0E930b7";
      const hexString =
        "0x7b2261646472657373223a2022307866413141663245323531656537333946383365313464376461436664373742336430453933306237222c202273616c74223a202230626337316536646538383034633438663138656530363837643664616630333133643836366633323565346566343365333730363164326263313635663539222c20227065726d697373696f6e73223a205b227369676e2d746f73225d2c202274696d657374616d70223a20313539363031383335312c20227369676e65725f74797065223a20226574685f7369676e222c20226d6163223a20223078633135303032663662656339303466386334323939626363636639653537613463326239636438303631373239386231383832303131386363636430313631613736323833656338623065393430653561653466666137626239343165616236227d";

      const basePayload = {
        id: 1596017791401300,
        jsonrpc: "2.0",
        method: "eth_sign",
      };

      const validPayload = {
        ...basePayload,
        params: [ethereumAddress, hexString],
      };

      const invalidPayload = {
        ...basePayload,
        params: [ethereumAddress, "invalid-hex-string"],
      };

      expect(WalletConnectEthSignJSONRPCSchema.isValidSync(validPayload)).toBeTruthy();
      expect(WalletConnectEthSignJSONRPCSchema.isValidSync(invalidPayload)).toBeFalsy();
    });
  });
});
