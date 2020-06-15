import { expect } from "chai";

import {
  convertFromUlps,
  convertToUlps,
  isLessThanOrEqualToZero,
  isZero,
  normalize,
  toPercentage,
} from "./NumberUtils";

describe("convertToUlps", () => {
  it("converts decimal to ulps representation", () => {
    expect(convertToUlps("123.4567")).to.eq("123456700000000000000");
  });
});

describe("convertFromUlps", () => {
  it("converts ulps to decimal representation", () => {
    expect(convertFromUlps("123456700000000000000").toString()).to.eq("123.4567");
  });
});

describe("normalize", () => {
  it("should normalize given number to a specified range", () => {
    expect(normalize({ min: "0", max: "100" }, "100")).to.eq("1");
    expect(normalize({ min: "0", max: "100" }, "0")).to.eq("0");
    expect(normalize({ min: "0", max: "100" }, "25")).to.eq("0.25");
    expect(normalize({ min: "0", max: "100" }, "80")).to.eq("0.8");
    expect(normalize({ min: "0", max: "100" }, "47.35")).to.eq("0.4735");
    expect(normalize({ min: "0", max: "200" }, "100")).to.eq("0.5");
    expect(normalize({ min: "0", max: "200" }, "150")).to.eq("0.75");
    expect(normalize({ min: "0", max: "250" }, "125")).to.eq("0.5");
    expect(normalize({ min: "0", max: "1000" }, "100")).to.eq("0.1");
  });
});

describe("isZero", () => {
  it("should correctly recognize zeros", () => {
    expect(isZero("000000000000000000")).to.be.true;
    expect(isZero("364458900000000000")).to.be.false;
  });
});

describe("isLessThanOrEqualToZero", () => {
  it("should correctly recognize zeros and negative values", () => {
    expect(isLessThanOrEqualToZero("000000000000000000")).to.be.true;
    expect(isLessThanOrEqualToZero("-364458900000000000")).to.be.true;
    expect(isLessThanOrEqualToZero("364458900000000000")).to.be.false;
  });
});

describe("toPercentage", () => {
  it("should correctly convert fraction to percentage", () => {
    expect(toPercentage("0.1312")).to.eq("13.12");
    expect(isLessThanOrEqualToZero("-364458900000000000")).to.be.true;
    expect(isLessThanOrEqualToZero("364458900000000000")).to.be.false;
  });
});
