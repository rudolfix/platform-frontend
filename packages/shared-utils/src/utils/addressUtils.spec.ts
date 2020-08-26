import { expect } from "chai";

import { isAddress, isChecksumAddress, trimAddress } from "./addressUtils";

describe("isAddress", () => {
  it("should return true for a valid address", () => {
    const addresses = [
      // checksummed
      "0x30fD2af22459B61F5bdfdDcaeF9BFaD6AcBF9fDC",
      // lower case
      "0x30fd2af22459b61f5bdfddcaef9bfad6acbf9fdc",
      // // upper case
      "0x30FD2AF22459B61F5BDFDDCAEF9BFAD6ACBF9FDC",
    ];

    addresses.forEach(address => {
      expect(isAddress(address)).to.be.true;
    });
  });

  it("should return false for an invalid address", () => {
    const addresses = [
      "",
      // mixed case
      "0x30Fd2AF22459B61F5bDFDDCAEF9BFAD6aCBF9FDc",
      "0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
      "random string",
    ];

    addresses.forEach(address => {
      expect(isAddress(address)).to.be.false;
    });
  });
});

describe("isChecksumAddress", () => {
  it("should return true for a valid address", () => {
    const addresses = [
      // checksummed
      "0x30fD2af22459B61F5bdfdDcaeF9BFaD6AcBF9fDC",
    ];

    addresses.forEach(address => {
      expect(isChecksumAddress(address)).to.be.true;
    });
  });

  it("should return false for an invalid address", () => {
    const addresses = [
      "",
      // lower case
      "0x30fd2af22459b61f5bdfddcaef9bfad6acbf9fdc",
      // upper case
      "0x30FD2AF22459B61F5BDFDDCAEF9BFAD6ACBF9FDC",
      // mixed case
      "0x30Fd2AF22459B61F5bDFDDCAEF9BFAD6aCBF9FDc",
      "0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
      "random string",
    ];

    addresses.forEach(address => {
      expect(isChecksumAddress(address)).to.be.false;
    });
  });
});

describe("trimAddress", () => {
  it("should return ellipsized address", () => {
    expect(trimAddress("0x30Fd2AF22459B61F5bDFDDCAEF9BFAD6aCBF9FDc")).to.be.equal(
      "0x30Fd2AF2...9FDc",
    );
  });
});
