import { expect } from "chai";
import { NumberFromString } from "../NumberFromString";
import { expectValidationError } from "./testUtils";

describe("NumberFromString", () => {
  it("should parse valid number", () => {
    const input = "12.54";

    const actual = NumberFromString.decode(input);

    expect(actual.value).to.be.be.eq(12.54);
  });

  it("should not parse invalid numbers", () => {
    const input = "12.54abc";

    const actual = NumberFromString.decode(input);

    expectValidationError(actual, "Value is not a number");
  });
});
