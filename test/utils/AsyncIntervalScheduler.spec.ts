import { expect } from "chai";
import { spy } from "sinon";
import { AsyncIntervalScheduler } from "../../app/utils/AsyncIntervalScheduler";
import { delay } from "../../app/utils/delay";
import { dummyLogger } from "../fixtures";
import { globalFakeClock } from "../setupTestsHooks";

describe("AsyncIntervalScheduler", () => {
  const expectedInterval = 500;

  it("should wait for async callback execution to finish", async () => {
    const expectedFunctionDelay = 2000;
    const asyncFunctionMock = spy(() => {
      return delay(expectedFunctionDelay);
    });
    const asyncInterval = new AsyncIntervalScheduler(
      dummyLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    globalFakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledOnce;

    // no more calls because async task takes time
    globalFakeClock.tick(expectedFunctionDelay);
    await Promise.resolve(); // let async function finish
    expect(asyncFunctionMock).to.be.calledOnce;

    globalFakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledTwice;
  });

  it("should not call callback before interval time passes", () => {
    const asyncFunctionMock = spy(async () => {});

    const asyncInterval = new AsyncIntervalScheduler(
      dummyLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    expect(asyncFunctionMock).to.be.not.calledOnce;
  });

  it("should allow to stop", () => {
    const asyncFunctionMock = spy(async () => {});

    const asyncInterval = new AsyncIntervalScheduler(
      dummyLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    globalFakeClock.tick(expectedInterval - 1);
    asyncInterval.stop();
    globalFakeClock.tick(1);
    expect(asyncFunctionMock).to.be.not.calledOnce;
  });

  it("should allow to stop during callback execution", async () => {
    const expectedFunctionDelay = 2000;
    const asyncFunctionMock = spy(() => {
      return delay(expectedFunctionDelay);
    });

    const asyncInterval = new AsyncIntervalScheduler(
      dummyLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    globalFakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledOnce;
    asyncInterval.stop();

    // wait for function execution to finish
    globalFakeClock.tick(expectedFunctionDelay);
    await Promise.resolve();

    globalFakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledOnce;
  });

  it("should do nothing when starting already started instance", () => {
    const expectedFunctionDelay = 2000;
    const asyncFunctionMock = spy(() => {
      return delay(expectedFunctionDelay);
    });
    const asyncInterval = new AsyncIntervalScheduler(
      dummyLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    globalFakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledOnce;

    asyncInterval.start();

    globalFakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledOnce;
  });

  it("should do nothing when stopped second time", () => {
    const asyncFunctionMock = spy(async () => {});

    const asyncInterval = new AsyncIntervalScheduler(
      dummyLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    globalFakeClock.tick(expectedInterval - 1);
    asyncInterval.stop();
    globalFakeClock.tick(1);
    expect(asyncFunctionMock).to.be.not.calledOnce;

    globalFakeClock.tick(expectedInterval - 1);
    asyncInterval.stop();
    globalFakeClock.tick(1);
    expect(asyncFunctionMock).to.be.not.calledOnce;
  });

  it("should work with sync functions", () => {
    const syncFunctionMock = spy(() => {});
    const asyncInterval = new AsyncIntervalScheduler(
      dummyLogger,
      syncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    globalFakeClock.tick(expectedInterval);
    expect(syncFunctionMock).to.be.calledOnce;

    globalFakeClock.tick(expectedInterval);
    expect(syncFunctionMock).to.be.calledTwice;
  });
});
