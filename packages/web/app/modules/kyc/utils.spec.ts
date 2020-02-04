import { expect } from "chai";

import { conditionalCounter } from "./utils";

describe("KYC utils tests", () => {
  it("Counter increments or decrements based on condition", () => {
    expect(conditionalCounter(true, 0)).to.eq(1);
    expect(conditionalCounter(true, 1)).to.eq(2);
    expect(conditionalCounter(false, 2)).to.eq(1);
    expect(conditionalCounter(false, 1)).to.eq(0);
  });
});
