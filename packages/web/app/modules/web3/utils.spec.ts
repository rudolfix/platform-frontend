import { expect } from "chai";

import { makeEthereumAddressChecksummed } from "./utils";

describe("Web3 utils", () => {
  it("makeEthereumAddressChecksummed returns checksummed address", () => {
    expect(makeEthereumAddressChecksummed("0xf538ca71b753e5fa634172c133e5f40ccaddaa80")).to.equal(
      "0xf538ca71b753E5fA634172c133e5f40ccaDDaA80",
    );
  });
});
