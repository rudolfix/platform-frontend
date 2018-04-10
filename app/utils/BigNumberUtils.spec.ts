import { expect } from "chai";
import { addBigNumbers, multiplyBigNumbers } from "./BigNumberUtils";

describe("BigNumber Utils", () => {
  describe("addBigNumbers", () => {
    it("should add", () => {
      expect(addBigNumbers(["100", "200", "1"])).to.be.eq("301");
    });
  });

  describe("multiplyBigNumbers", () => {
    it("should multiply", () => {
      expect(multiplyBigNumbers(["10", "3", "5"])).to.be.eq("150");
    });
  });
});
