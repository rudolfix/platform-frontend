import {
  InvalidWalletConnectUriError,
  isValidWalletConnectUri,
  parseWalletConnectUri,
} from "./utils";

const invalidUris = [
  "invalid:f2b44876-7cbf-4a04-ac82-909525d647d2@1?bridge=https%3A%2F%2Fplatform.neufund.io%2Fapi%2Fwc-bridge-socket%2F&key=d3d0c3ab280886cd52c52051ec2b809e0139f36bab07abaad742bd9abe0e61a2",
  "wc:?bridge=https%3A%2F%2Fplatform.neufund.io%2Fapi%2Fwc-bridge-socket%2F&key=d3d0c3ab280886cd52c52051ec2b809e0139f36bab07abaad742bd9abe0e61a2",
  "wc:f2b44876-7cbf-4a04-ac82-909525d647d2@1?key=d3d0c3ab280886cd52c52051ec2b809e0139f36bab07abaad742bd9abe0e61a2",
  "wc:f2b44876-7cbf-4a04-ac82-909525d647d2@1?bridge=https%3A%2F%2Fplatform.neufund.io%2Fapi%2Fwc-bridge-socket%2F",
  ":f2b44876-7cbf-4a04-ac82-909525d647d2@1?bridge=https%3A%2F%2Fplatform.neufund.io%2Fapi%2Fwc-bridge-socket%2F",
  "f2b44876-7cbf-4a04-ac82-909525d647d2@1?bridge=https%3A%2F%2Fplatform.neufund.io%2Fapi%2Fwc-bridge-socket%2F",
];

describe("parseWalletConnectUri", () => {
  it("should properly parse wallet connect uri", () => {
    expect(
      parseWalletConnectUri(
        "wc:f2b44876-7cbf-4a04-ac82-909525d647d2@1?bridge=https%3A%2F%2Fplatform.neufund.io%2Fapi%2Fwc-bridge-socket%2F&key=d3d0c3ab280886cd52c52051ec2b809e0139f36bab07abaad742bd9abe0e61a2",
      ),
    ).toEqual({
      bridge: "https://platform.neufund.io/api/wc-bridge-socket/",
      handshakeTopic: "f2b44876-7cbf-4a04-ac82-909525d647d2",
      key: "d3d0c3ab280886cd52c52051ec2b809e0139f36bab07abaad742bd9abe0e61a2",
      protocol: "wc",
      version: 1,
    });
  });

  it("should throw an error on invalid uri", () => {
    invalidUris.forEach(uri => {
      expect(() => parseWalletConnectUri(uri)).toThrow(InvalidWalletConnectUriError);
    });
  });
});

describe("isValidWalletConnectUri", () => {
  it("should properly validate uri validity", () => {
    [
      "wc:f2b44876-7cbf-4a04-ac82-909525d647d2@1?bridge=https%3A%2F%2Fplatform.neufund.io%2Fapi%2Fwc-bridge-socket%2F&key=d3d0c3ab280886cd52c52051ec2b809e0139f36bab07abaad742bd9abe0e61a2",
    ].forEach(uri => {
      expect(isValidWalletConnectUri(uri)).toBeTruthy();
    });

    invalidUris.forEach(uri => {
      expect(isValidWalletConnectUri(uri)).toBeFalsy();
    });
  });
});
