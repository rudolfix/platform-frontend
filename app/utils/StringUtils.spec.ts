import { expect } from "chai";
import { extractNumber } from "./StringUtils";

describe("StringUtils", () => {
  describe("extractNumber", () => {
    it("extracts only numerical values from a string", () => {
      expect(extractNumber("123asdf .23")).to.eq('123.23')
    });
  })
});

