import { expect } from "chai";
import { spy } from "sinon";

import {
  callWithCount,
  ESagaTestDynamicProviderResult,
  takeWithCount,
  throwError,
} from "./sagaTestUtils";

describe("sagaTestUtils", () => {
  describe("throwError", () => {
    const error = new Error("foobar");
    expect(throwError(error)).to.deep.eq({
      result: ESagaTestDynamicProviderResult.ERROR,
      payload: error,
    });
  });

  describe("callWithCount", () => {
    const testFunction = () => "bla!";
    const nonMatchingFunction = () => "no match for bla!";

    const next = spy();
    const testCallEffect = {
      context: {},
      fn: testFunction,
      args: [],
    };

    const nonMatchingTestCallEffect = {
      context: {},
      fn: nonMatchingFunction,
      args: [],
    };

    it("it returns functionReturn value if function provided matches function expected", () => {
      const result = callWithCount({
        count: 1,
        expectedFunction: testFunction,
        functionReturn: "test_function_return",
      })(testCallEffect, next);
      expect(result).to.eq("test_function_return");
      expect(next).to.not.have.been.called;
    });

    it("it throws an expected error if function provided matches function expected", () => {
      expect(() =>
        callWithCount({
          count: 1,
          expectedFunction: testFunction,
          functionReturn: throwError(new Error("bla!!")),
        })(testCallEffect, next),
      ).to.throw("bla!!");
    });

    it("it calls next() if function provided doesn't match function expected", () => {
      callWithCount({
        count: 1,
        expectedFunction: testFunction,
        functionReturn: "test_function_return",
      })(nonMatchingTestCallEffect, next);
      expect(next).to.have.been.called;
    });
  });

  describe("takeWithCount", () => {
    const testAction = () => ({ type: "TEST_ACTION", payload: { value: "test_value" } });
    const nonMatchingAction = () => ({
      type: "NON_MATCHING_TEST_ACTION",
      payload: { value: "I'm no match for you" },
    });

    const next = spy();
    const testCallEffect = {
      pattern: testAction,
      maybe: false,
    };

    const nonMatchingTestCallEffect = {
      pattern: nonMatchingAction,
      maybe: false,
    };

    it("it returns functionReturn value if function provided matches function expected", () => {
      const result = takeWithCount({
        count: 1,
        actionCreator: testAction,
        actionPayload: { value: "test_value" },
      })(testCallEffect, next);
      expect(result).to.deep.eq({ value: "test_value" });
      expect(next).to.not.have.been.called;
    });

    it("it calls next() if function provided doesn't match function expected", () => {
      takeWithCount({
        count: 1,
        actionCreator: testAction,
        actionPayload: { value: "I'm no match for you" },
      })(nonMatchingTestCallEffect, next);
      expect(next).to.have.been.called;
    });
  });
});
