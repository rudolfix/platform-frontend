import { expect } from "chai";
import { convertToBigInt, formatMoney, formatThousands } from "./Money.utils";

describe("Money utils", () => {
  describe("formatMoney", () => {
    it("should format money", () => {
      expect(formatMoney("10000", 2, 2)).to.be.eq("100.00");
      expect(formatMoney("10000", 5, 2)).to.be.eq("0.10");
      expect(formatMoney("100000000000000000000", 1, 1)).to.be.eq("10000000000000000000.0");
    });
  });

  describe("formatThousands", () => {
    it("should format thousands", () => {
      expect(formatThousands(formatMoney("10000", 2, 2))).to.be.eq("100.00");
      expect(formatThousands(formatMoney("100000", 2, 2))).to.be.eq("1 000.00");
      expect(formatThousands("1000.0")).to.be.eq("1 000.0");
      expect(formatThousands("1000")).to.be.eq("1 000");
    });

    it("should not format decimal places", () => {
      expect(formatThousands(formatMoney("100000", 2, 4))).to.be.eq("1 000.0000");
    });

    it("should handle undefined", () => {
      expect(formatThousands()).to.be.eq("");
      expect(formatThousands("")).to.be.eq("");
    });
  });

  describe("convertToBigInt", () => {
    it("converts decimal currencies to bigInt representation", () => {
      expect(convertToBigInt("123.4567")).to.eq("123456700000000000000");
      expect(convertToBigInt("123.4567", 6)).to.eq("123456700");
      expect(convertToBigInt("123.4567", 2)).to.eq("12346");
      expect(convertToBigInt("65.4321", 2)).to.eq("6544");
    });
  });
});
