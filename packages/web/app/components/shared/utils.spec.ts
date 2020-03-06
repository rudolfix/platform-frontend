import { setupFakeClock } from "@neufund/shared/tests";
import { expect } from "chai";
import * as moment from "moment";

import { calculateTimeLeftUnits, getTomorrowsDate } from "./utils";

describe("utils", () => {
  describe("timeLeft utils", () => {
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;

    it("calculates days hours minutes left 1", () => {
      const [days, hours, minutes, seconds] = calculateTimeLeftUnits(day * 5 + 32);

      expect(days).to.eq(5);
      expect(hours).to.eq(0);
      expect(minutes).to.eq(0);
      expect(seconds).to.eq(32);
    });
    it("calculates days hours minutes left 2", () => {
      const [days, hours, minutes, seconds] = calculateTimeLeftUnits(hour * 3 + minute * 3 + 21);

      expect(days).to.eq(0);
      expect(hours).to.eq(3);
      expect(minutes).to.eq(3);
      expect(seconds).to.eq(21);
    });

    it("calculates days hours minutes left 3", () => {
      const [days, hours, minutes, seconds] = calculateTimeLeftUnits(
        day * 5 + hour * 3 + minute * 3 + 21,
      );

      expect(days).to.eq(5);
      expect(hours).to.eq(3);
      expect(minutes).to.eq(3);
      expect(seconds).to.eq(21);
    });

    it("calculates seconds left 3", () => {
      const [days, hours, minutes, seconds] = calculateTimeLeftUnits(3);

      expect(days).to.eq(0);
      expect(hours).to.eq(0);
      expect(minutes).to.eq(0);
      expect(seconds).to.eq(3);
    });
  });

  describe("getTomorrowsDate", () => {
    const clock = setupFakeClock();

    it("should return tomorrows date", () => {
      clock.fakeClock.setSystemTime(
        moment("2020-02-02T09")
          .toDate()
          .getTime(),
      );
      const date = getTomorrowsDate();

      expect(
        moment(date)
          .utc()
          .format(),
      ).to.eq("2020-02-03T00:00:00Z");
    });
  });
});
