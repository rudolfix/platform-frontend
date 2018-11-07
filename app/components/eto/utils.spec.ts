import { expect } from "chai";

import {
  applyDefaults,
  convert,
  convertFractionToPercentage,
  convertPercentageToFraction,
  convertToPrecision,
  parseStringToFloat,
  sanitizeKeyValueCompoundField,
} from "./utils";

describe("sanitizeKeyValueCompoundField", () => {
  it("returns an array without empty objects", () => {
    const input = [{ a: 1, b: 2 }, { a: undefined }];
    const expected = [{ a: 1, b: 2 }];
    expect(sanitizeKeyValueCompoundField(input)).to.deep.equal(expected);
  });
  it("returns undefined if resulting array is empty", () => {
    const input = [{ a: undefined, b: undefined }, { a: undefined }];
    expect(sanitizeKeyValueCompoundField(input)).to.be.undefined;
  });
});

describe("applyDefaults", () => {
  it("sets defaults if value is missing/undefined", () => {
    const data = { key1: "value", key2: 222, key3: null, key4: undefined };
    const defaults = {
      key2: "defaultValue 2",
      key3: "defaultValue 3",
      key4: "defaultValue 4",
      key5: "defaultValue 5",
    };
    const output = {
      key1: "value",
      key2: 222,
      key3: "defaultValue 3",
      key4: "defaultValue 4",
      key5: "defaultValue 5",
    };
    expect(applyDefaults(data, defaults)).to.deep.equal(output);
  });
});

describe("convert", () => {
  it("iterates through conversionSpec object, gets data, denoted as key of conversion spec, and applies conversion functions to it", () => {
    const bla2fufu = (input: any) => (input === "bla" ? "fufu" : input);
    const data = {
      key1: "bla",
      key2: {
        key2_1: "bla",
        key2_2: "foobar",
      },
    };

    const spec = {
      key1: bla2fufu,
      "key2.key2_1": bla2fufu,
    };

    const expectedOutput = {
      key1: "fufu",
      key2: {
        key2_1: "fufu",
        key2_2: "foobar",
      },
    };
    expect(convert(data, spec)).to.deep.equal(expectedOutput);
  });
});

describe("convertPercentageToFraction", () => {
  it("converts float representing percentage to a fractional representation with max precision of 4 (for our backend)", () => {
    const percentage = 12.345978;
    const expectedOutput = "0.1235";

    expect(convertPercentageToFraction(percentage).toString()).to.be.equal(expectedOutput);
  });
});

describe("convertFractionToPercentage", () => {
  it("converts fractional representation to a float representing percents", () => {
    const data = 0.2343;
    const expectedOutput = "23.43";

    expect(convertFractionToPercentage(data).toString()).to.be.equal(expectedOutput);
  });
});

describe("parseStringToFloat", () => {
  it("tries to parse string to float and returns a float or an undefined", () => {
    const goodString = "2.56";
    const badString = "bla";

    expect((parseStringToFloat(goodString) as number).toString()).to.be.equal(goodString);
    expect(parseStringToFloat(badString)).to.be.undefined;
  });
});

describe("convertToPrecision", () => {
  it("imitates converting a floating point to a fixed precision number, returns undefined if input is invalid", () => {
    const float = 2.3456;
    const badData = parseInt("bla", 2);
    const expectedResult = "2.35";
    expect((convertToPrecision(float, 2) as number).toString()).equal(expectedResult);
    expect(convertToPrecision(badData, 2)).is.undefined;
  });
});
