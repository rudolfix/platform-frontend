import { expect } from "chai";

import { isNonNullable } from "./isNonNullable";

describe("isNonNullable", () => {
  it("should return true if value is not undefined or null", () => {
    expect(isNonNullable({})).to.be.true;
    expect(isNonNullable("foo")).to.be.true;
    expect(isNonNullable(undefined)).to.be.false;
    expect(isNonNullable(null)).to.be.false;
  });
});
