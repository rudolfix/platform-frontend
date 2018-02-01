import { expect } from "chai";

import { DEFAULT_DERIVATION_PATH_PREFIX } from "../../app/modules/wallet-selector/ledger-wizard/reducer";
import { derivationPathPrefixValidator } from "../../app/utils/Validators";

describe("Validators", () => {
  describe("derivationPathPrefixValidator", () => {
    const correctPrefix = DEFAULT_DERIVATION_PATH_PREFIX;
    const incorrectPrefix = [
      "44'/60'/0'",
      "44'/60'/'/",
      "44'/60'/0'/1",
      "44'/61'/0'/",
      "45'/61'/0'/",
    ];

    it("should return null for correct prefix path", () => {
      expect(derivationPathPrefixValidator(correctPrefix)).to.be.null;
    });

    it("should return string message for incorrect prefix path", () => {
      for (const dp of incorrectPrefix) {
        const validationResult = derivationPathPrefixValidator(dp);
        expect(validationResult).to.be.not.null;
        expect(validationResult).to.be.a("string");
        expect(validationResult!.length).to.be.greaterThan(0);
      }
    });
  });
});
