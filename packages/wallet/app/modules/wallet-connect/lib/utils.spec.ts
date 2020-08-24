import {
  InvalidWalletConnectUriError,
  isValidWalletConnectUri,
  parseDigestString,
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

describe("parseDigestString", () => {
  it("should parse & validate digest string", () => {
    const validDigestString =
      "0x7b2261646472657373223a2022307866413141663245323531656537333946383365313464376461436664373742336430453933306237222c202273616c74223a202261363531393439336331613237636266326561623533313838313733656564636166636138386336373664356531346239383133626231616363326664376663222c20227065726d697373696f6e73223a205b227369676e2d746f73225d2c202274696d657374616d70223a20313539363533343532362c20227369676e65725f74797065223a20226574685f7369676e222c20226d6163223a20223078386364643561316532616362303362383731646233643563353435343566616230616438626533623738383935316665613435396465366664616335366434363263386231363831333362393266643435353961336463383261373139383437227d";
    expect(parseDigestString(validDigestString)).toEqual({
      permissions: ["sign-tos"],
    });

    const invalidDigestString = "0xinvalid-digest-string";
    expect(() => parseDigestString(invalidDigestString)).toThrowError();

    // valid hex, but with `permissions` property called `permission`
    const invalidDigestString2 =
      "0x7b2261646472657373223a2022307866413141663245323531656537333946383365313464376461436664373742336430453933306237222c202273616c74223a202261363531393439336331613237636266326561623533313838313733656564636166636138386336373664356531346239383133626231616363326664376663222c20227065726d697373696f6e223a205b227369676e2d746f73225d2c202274696d657374616d70223a20313539363533343532362c20227369676e65725f74797065223a20226574685f7369676e222c20226d6163223a20223078386364643561316532616362303362383731646233643563353435343566616230616438626533623738383935316665613435396465366664616335366434363263386231363831333362393266643435353961336463383261373139383437227d";
    expect(() => parseDigestString(invalidDigestString2)).toThrowError();
  });
});
