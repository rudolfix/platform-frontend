import { isValidTransactionRequestUri } from "./transactionRequestUtils";

describe("transactionRequestUtils", () => {
  it("isValidTransactionRequest", () => {
    const invalidUris = ["", "ethereum:", "ethereum:pay0x1234DEADBEEF5678ABCD1234DEADBEEF5678ABCD"];
    invalidUris.forEach(uri => expect(isValidTransactionRequestUri(uri)).toBeFalsy());

    const validUris = [
      "ethereum:0x1234DEADBEEF5678ABCD1234DEADBEEF5678ABCD/transfer?address=0x12345&uint256=1",
      "ethereum:0x1234DEADBEEF5678ABCD1234DEADBEEF5678ABCD?value=2.014e18&gas=10&gasLimit=21000&gasPrice=50",
    ];
    validUris.forEach(uri => expect(isValidTransactionRequestUri(uri)).toBeTruthy());
  });
});
