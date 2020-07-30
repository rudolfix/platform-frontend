import { matchers } from "@neufund/sagas/tests";
import { EDelayTiming, safeDelay, unixTimestampToTimestamp } from "@neufund/shared-utils";
import { setupFakeClock } from "@neufund/shared-utils/tests";

import { bootstrapModule } from "../../../tests";
import { createLibSymbol } from "../../../utils";
import { IEthManager, ISingleKeyStorage } from "../../core/module";
import { setupAuthModule } from "../module";
import { jwtActions } from "./actions";
import { JwtNotAvailable } from "./errors";
import { handleJwtTimeout, refreshJWT, selectJwt } from "./sagas";

type TSetupOptions = {
  jwtTimingThreshold: number;
  jwtRefreshThreshold: number;
};

const JWT_REFRESH_TRESHOLD = 10000;
const JWT_TIMING_THRESHOLD = 100;

const JWT = {
  parsed: {
    permissions: [],
    iat: 1560461473,
    exp: 1560547873,
  },
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzUxMiJ9.eyJzdWIiOiIweDc0MTgwQjU2REQ3NEJDNTZhMkU5RDU3MjBGMzkyNDdjNTVGMjMzMjgiLCJ1aWQiOiIweDc0MTgwQjU2REQ3NEJDNTZhMkU5RDU3MjBGMzkyNDdjNTVGMjMzMjgiLCJ1aWRfdHlwZSI6IndhbGxldF9hZGRyZXNzIiwiZXhwIjoxNTYwNTQ3ODczLCJpc3MiOiJuZXVmdW5kIiwiYXVkIjoiZXh0ZXJuYWwiLCJpYXQiOjE1NjA0NjE0NzMuMjczNDA4NywianRpIjoiMzg0ZDJiMGQtMzVlMy00MGU5LWJkYmMtZjllOWNjZTMyNzA0IiwicGVybWlzc2lvbnMiOnt9fQ.ADlSax5yr6U3npaBXPV0nkOmWvFaQjeteMbaxLWdrAjpE3Lv8GDG3_4t_wkWxwRfK-Anw6RUsqMuIrCdrYuqZt8-AFvtUaZgoBMqxawMdjugywEF7_tVsELSbbL53wOoIpeCzR1B-45Wj7sOgruOJMf2zjVb__894PnIqER5ULnZeW0D",
};

const TICKS_TO_EXP = unixTimestampToTimestamp(JWT.parsed.exp - JWT.parsed.iat);

const setupTest = ({ jwtTimingThreshold, jwtRefreshThreshold }: TSetupOptions) => {
  const jwtStorageSymbol = createLibSymbol<ISingleKeyStorage<string>>("jwtStorage");
  const ethManagerSymbol = createLibSymbol<IEthManager>("ethStorage");

  return bootstrapModule(
    setupAuthModule({
      backendRootUrl: "invalid-url",
      jwtStorageSymbol,
      ethManagerSymbol,
      jwtTimingThreshold: jwtTimingThreshold,
      jwtRefreshThreshold: jwtRefreshThreshold,
    }),
  );
};

describe("Auth - JWT - Integration Test", () => {
  describe("handleJwtTimeout", () => {
    const clock = setupFakeClock(unixTimestampToTimestamp(JWT.parsed.iat));

    it("should throw an error when jwt is not available", async () => {
      const { expectSaga } = setupTest({
        jwtRefreshThreshold: JWT_REFRESH_TRESHOLD,
        jwtTimingThreshold: JWT_TIMING_THRESHOLD,
      });

      await expectSaga(handleJwtTimeout)
        .provide([[matchers.select(selectJwt), undefined]])
        .throws(JwtNotAvailable)
        .run();
    });

    it("should throw an error when jwt timing threshold is higher than jwt refresh threshold", async () => {
      const { expectSaga } = setupTest({
        jwtRefreshThreshold: 1,
        jwtTimingThreshold: 2,
      });

      await expectSaga(handleJwtTimeout)
        .provide([[matchers.select(selectJwt), JWT.token]])
        .throws(Error)
        .run();
    });

    it("should dispatch `jwtTimeout` when timing is delayed", async () => {
      const { expectSaga } = setupTest({
        jwtRefreshThreshold: JWT_REFRESH_TRESHOLD,
        jwtTimingThreshold: JWT_TIMING_THRESHOLD,
      });

      clock.fakeClock.tick(TICKS_TO_EXP);

      const calculatedTimeLeftWithThreshold = 0;

      await expectSaga(handleJwtTimeout)
        .provide([
          [matchers.select(selectJwt), JWT.token],
          [
            matchers.call(safeDelay, calculatedTimeLeftWithThreshold, {
              threshold: JWT_TIMING_THRESHOLD,
            }),
            EDelayTiming.DELAYED,
          ],
        ])
        .put(jwtActions.jwtTimeout())
        .run();
    });

    it("should call `refreshJWT` when timing is exact", async () => {
      const { expectSaga } = setupTest({
        jwtRefreshThreshold: JWT_REFRESH_TRESHOLD,
        jwtTimingThreshold: JWT_TIMING_THRESHOLD,
      });

      clock.fakeClock.tick(TICKS_TO_EXP - JWT_REFRESH_TRESHOLD * 2);

      const calculatedTimeLeftWithThreshold = JWT_REFRESH_TRESHOLD;

      await expectSaga(handleJwtTimeout)
        .provide([
          [matchers.select(selectJwt), JWT.token],
          [matchers.call(refreshJWT), undefined],
          [
            matchers.call(safeDelay, calculatedTimeLeftWithThreshold, {
              threshold: JWT_TIMING_THRESHOLD,
            }),
            EDelayTiming.EXACT,
          ],
        ])
        .call(refreshJWT)
        .run();
    });
  });
});
