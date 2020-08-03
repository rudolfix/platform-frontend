import { expect } from "chai";
import * as React from "react";
import { spy } from "sinon";

import { useOnEnterKeyPress } from "./useOnKeyPress";

const testFn = spy();
const onEnter = useOnEnterKeyPress(testFn);

describe("useOnEnterKeyPress", () => {
  afterEach(() => {
    testFn.resetHistory();
  });

  it("should call the supplied function when user hits Enter", async () => {
    onEnter({
      which: 13,
      keyCode: 13,
      shiftKey: false,
    } as React.KeyboardEvent);
    expect(testFn).to.have.been.called;
  });

  it("should only work for specified key", async () => {
    onEnter({
      which: 12,
      keyCode: 12,
      shiftKey: false,
    } as React.KeyboardEvent);
    expect(testFn).to.not.have.been.called;
  });
});
