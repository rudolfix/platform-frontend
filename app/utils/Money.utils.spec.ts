import { expect } from "chai";

import {
  ERoundingMode,
  formatMoney,
  isValidNumberOrEmpty,
  parseInputToNumber,
  stripNumberFormatting,
} from "./Money.utils";

describe("Money utils", () => {
  describe("formatMoney", () => {
    it("should format money", () => {
      expect(formatMoney("10000", 2, 2)).to.be.eq("100.00");
      expect(formatMoney("10000", 5, 2)).to.be.eq("0.10");
      expect(formatMoney("100000000000000000000", 1, 1)).to.be.eq("10000000000000000000.0");
    });

    it("should correctly round", () => {
      expect(formatMoney("10.888", 0, 2, ERoundingMode.UP)).to.be.eq("10.89");
      expect(formatMoney("10.882", 0, 2, ERoundingMode.UP)).to.be.eq("10.89");
      expect(formatMoney("10.888", 0, 2, ERoundingMode.DOWN)).to.be.eq("10.88");
      expect(formatMoney("10.888", 0, 2, ERoundingMode.HALF_UP)).to.be.eq("10.89");
      expect(formatMoney("10.882", 0, 2, ERoundingMode.HALF_UP)).to.be.eq("10.88");
      expect(formatMoney("10.888", 0, 2, ERoundingMode.HALF_DOWN)).to.be.eq("10.89");
      expect(formatMoney("10.882", 0, 2, ERoundingMode.HALF_DOWN)).to.be.eq("10.88");
    });
  });

  describe("parseInputToNumber", () => {
    it("returns an empty string if input is empty", () => {
      expect(parseInputToNumber("")).to.eq("");
      expect(parseInputToNumber(undefined)).to.eq("");
    });
    it("returns null if input value is not a valid number", () => {
      expect(parseInputToNumber("12a3")).to.be.null;
      expect(parseInputToNumber("123.")).to.be.null;
      expect(parseInputToNumber("123,")).to.be.null;
      expect(parseInputToNumber(",123")).to.be.null;
      expect(parseInputToNumber(".123")).to.be.null;
      expect(parseInputToNumber("123..123")).to.be.null;
      expect(parseInputToNumber("123,,123")).to.be.null;
      expect(parseInputToNumber("123.,123")).to.be.null;
      expect(parseInputToNumber("123.123,123.123")).to.be.null;
      expect(parseInputToNumber("123,123.123,123")).to.be.null;
      expect(parseInputToNumber("123.123,123,123")).to.be.null;
      expect(parseInputToNumber("123,123.123.123")).to.be.null;
    });
    it("returns a number string in correct format if input value is a parseable number", () => {
      expect(parseInputToNumber("12334")).to.eq("12334");
      expect(parseInputToNumber("12334.22")).to.eq("12334.22");
      expect(parseInputToNumber("12334,22")).to.eq("12334.22");
      expect(parseInputToNumber("222,222,222.22")).to.eq("222222222.22");
      expect(parseInputToNumber("222.222.222,22")).to.eq("222222222.22");
      expect(parseInputToNumber("213.213.44")).to.eq("21321344");
      expect(parseInputToNumber("222.22")).to.eq("222.22");
      expect(parseInputToNumber("213,213,44")).to.eq("21321344");
      expect(parseInputToNumber("222,22")).to.eq("222.22");
      expect(parseInputToNumber("222.222,22")).to.eq("222222.22");
      expect(parseInputToNumber("222.222,22")).to.eq("222222.22");
      expect(parseInputToNumber("222,222.22")).to.eq("222222.22");
    });
  });

  describe("stripNumberFormatting", () => {
    it("should pass through invalid input", () => {
      expect(stripNumberFormatting(".")).to.be.eq(".");
      expect(stripNumberFormatting("")).to.be.eq("");
    });
    it("should strip thousand formatting and trailing zeroes from decimal part", () => {
      expect(stripNumberFormatting("0")).to.be.eq("0");
      expect(stripNumberFormatting("33")).to.be.eq("33");
      expect(stripNumberFormatting("2 221")).to.be.eq("2221");
      expect(stripNumberFormatting("2 2210")).to.be.eq("22210");
      expect(stripNumberFormatting("1 221 222.00000")).to.be.eq("1221222");
      expect(stripNumberFormatting("1 221 222.000010")).to.be.eq("1221222.00001");
      expect(stripNumberFormatting("1 221 222.02010")).to.be.eq("1221222.0201");
    });
  });

  describe("isValidNumberOrEmpty", () => {
    it('should allow empty values (undefined and "")', () => {
      expect(isValidNumberOrEmpty("")).to.be.true;
      expect(isValidNumberOrEmpty(undefined)).to.be.true;
    });
    it("should allow valid input", () => {
      expect(isValidNumberOrEmpty("0")).to.be.true;
      expect(isValidNumberOrEmpty("10")).to.be.true;
      expect(isValidNumberOrEmpty("1.011")).to.be.true;
      expect(isValidNumberOrEmpty("1,011")).to.be.true;
      expect(isValidNumberOrEmpty("1 221.011")).to.be.true;
      expect(isValidNumberOrEmpty("1 221,011")).to.be.true;
    });
    it("should disallow invalid input", () => {
      expect(isValidNumberOrEmpty(",")).to.be.false;
      expect(isValidNumberOrEmpty(".")).to.be.false;
      expect(isValidNumberOrEmpty("x")).to.be.false;
      expect(isValidNumberOrEmpty("1,.1")).to.be.false;
      expect(isValidNumberOrEmpty("11,")).to.be.false;
      expect(isValidNumberOrEmpty("11.")).to.be.false;
      expect(isValidNumberOrEmpty(",11")).to.be.false;
      expect(isValidNumberOrEmpty(".11")).to.be.false;
      expect(isValidNumberOrEmpty("1,520.25")).to.be.false;
      expect(isValidNumberOrEmpty("1.520,25")).to.be.false;
      expect(isValidNumberOrEmpty("1a")).to.be.false;
    });
  });
});
