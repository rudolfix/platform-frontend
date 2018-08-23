import { expect } from "chai";
import BigNumber from "bignumber.js";

import { addBigNumbers, multiplyBigNumbers, divideBigNumbers } from "./BigNumberUtils";

describe("BigNumber Utils", () => {
  describe("addBigNumbers", () => {
    it("should add", () => {
      expect(addBigNumbers(["100", "200", "1"])).to.be.eq("301");
      expect(addBigNumbers(["100", new BigNumber(200), 1])).to.be.eq("301");
    });
  });

  describe("multiplyBigNumbers", () => {
    it("should multiply", () => {
      expect(multiplyBigNumbers(["10", "3", "5"])).to.be.eq("150");
      expect(multiplyBigNumbers(["10", 3, new BigNumber("5")])).to.be.eq("150");
    });
  });

  describe("divideBigNumbers", () => {
    it("should divide", () => {
      expect(divideBigNumbers("1000", "5")).to.eq("200")
      expect(divideBigNumbers(1000, new BigNumber(5))).to.eq("200")
    })
  })
});
