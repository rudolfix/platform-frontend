import { expect } from "chai";

import { sanitizeKeyValueCompoundField } from "./utils";

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
