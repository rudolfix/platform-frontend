import { expect } from "chai";
import { IntegerFromString } from "../IntegerFromString";
import { expectValidationError } from "./testUtils";

describe("IntegerFromString", () => {
  it("should parse valid integers", () => {
    const input = "123";

    const actual = IntegerFromString.decode(input);

    expect(actual.value).to.be.be.eq(123);
  });

  it("should not parse valid number", () => {
    const input = "123.23";

    const actual = IntegerFromString.decode(input);

    expectValidationError(actual, "Value is not an integer");
  });

  it("should not parse invalid numbers", () => {
    const input = "12.54abc";

    const actual = IntegerFromString.decode(input);

    expectValidationError(actual, "Value is not an integer");
  });
});
