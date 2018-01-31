import * as Bluebird from "bluebird";
import { expect } from "chai";

import { isPromise } from "../../app/utils/isPromise";

describe("isPromise", () => {
  it("should detect native promises", () => {
    expect(isPromise(Promise.resolve("test"))).to.be.true;
  });

  it("should detected bluebird promise", () => {
    expect(isPromise(Bluebird.resolve("test2"))).to.be.true;
  });

  it("should detect not promises", () => {
    expect(isPromise(5)).to.be.false;
  });
});
