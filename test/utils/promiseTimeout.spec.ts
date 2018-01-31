import { expect } from "chai";
import { delay } from "../../app/utils/delay";
import { promiseTimeout } from "../../app/utils/promiseTimeout";
import { globalFakeClock } from "../setupTestsHooks";

describe("promiseTimeout", () => {
  it("should return promise value if resolved within time frame", async () => {
    const expectedReturnValue = 2;
    const fastPromise = async () => {
      await delay(500);
      return expectedReturnValue;
    };

    const actualReturnValuePromise = promiseTimeout({
      promise: fastPromise(),
      defaultValue: 5,
      timeout: 1000,
    });

    globalFakeClock.tick(500);
    const actualReturnValue = await actualReturnValuePromise;
    // this shouldn't do anything
    globalFakeClock.tick(500);

    expect(actualReturnValue).to.be.eq(expectedReturnValue);
  });

  it("should return default value on timeout", async () => {
    const expectedReturnValue = 2;
    const fastPromise = async () => {
      await delay(1000);
      return 42;
    };

    const actualReturnValuePromise = promiseTimeout({
      promise: fastPromise(),
      defaultValue: expectedReturnValue,
      timeout: 500,
    });

    globalFakeClock.tick(500);
    const actualReturnValue = await actualReturnValuePromise;
    // this shouldn't do anything
    globalFakeClock.tick(500);

    expect(actualReturnValue).to.be.eq(expectedReturnValue);
  });
});
