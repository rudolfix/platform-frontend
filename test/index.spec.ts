import { expect } from "chai";

import { functionToTest } from "../app/exampleModule";

describe("index.ts", () => {
  it("should return true", () => {
    expect(functionToTest()).to.be.true;
  });
});
