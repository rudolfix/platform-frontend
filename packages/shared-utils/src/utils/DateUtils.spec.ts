import { expect } from "chai";
import moment from "moment";

import {
  calculateTimeLeftUnits,
  formatDate,
  getTomorrowsDate,
  isLessThanNDays,
  isLessThanNHours,
  isLessThanNMinutes,
  minutesToMs,
  secondsToMs,
} from "./DateUtils";
import { setupFakeClock } from "./test/setupFakeClock";

describe("date utils", () => {
  describe("formatDate", () => {
    it("formats dates", () => {
      const date = new Date("12/24/2018");
      expect(formatDate(date.getTime())).to.equal("12/24/2018");
    });
  });

  describe("isLessThanNDays", () => {
    it("compares dates", () => {
      const date1 = new Date("12/24/2018");
      const date2 = new Date("12/20/2018");
      const date3 = new Date("12/22/2018");
      const date4 = new Date("12/21/2018");

      expect(isLessThanNDays(date2, date1, 3)).to.be.false;
      expect(isLessThanNDays(date3, date1, 3)).to.be.true;
      expect(isLessThanNDays(date4, date1, 3)).to.be.false;
      expect(isLessThanNDays(date4, date1, 4)).to.be.true;
    });
  });

  describe("isLessThanNHours", () => {
    it("compares dates", () => {
      const date1 = new Date("2018-12-24T10:00:00Z");
      const date2 = new Date("2018-12-24T06:00:00Z");
      const date3 = new Date("2018-12-24T08:00:00Z");
      const date4 = new Date("2018-12-24T07:00:00Z");

      expect(isLessThanNHours(date2, date1, 3)).to.be.false;
      expect(isLessThanNHours(date3, date1, 3)).to.be.true;
      expect(isLessThanNHours(date4, date1, 3)).to.be.false;
      expect(isLessThanNHours(date4, date1, 4)).to.be.true;
    });
  });

  describe("isLessThanNMinutes", () => {
    it("compares dates", () => {
      const date1 = new Date("2018-12-24T10:10:00Z");
      const date2 = new Date("2018-12-24T10:06:00Z");
      const date3 = new Date("2018-12-24T10:08:00Z");
      const date4 = new Date("2018-12-24T10:07:00Z");

      expect(isLessThanNMinutes(date2, date1, 3)).to.be.false;
      expect(isLessThanNMinutes(date3, date1, 3)).to.be.true;
      expect(isLessThanNMinutes(date4, date1, 3)).to.be.false;
      expect(isLessThanNMinutes(date4, date1, 4)).to.be.true;
    });
  });

  describe("minutesToMs", () => {
    it("should convert minutes to ms", () => {
      expect(minutesToMs(10)).to.equal(600000);
      expect(minutesToMs(0.0001)).to.equal(6);
    });
  });

  describe("secondsToMs", () => {
    it("should convert seconds to ms", () => {
      expect(secondsToMs(10)).to.equal(10000);
      expect(secondsToMs(0.001)).to.equal(1);
    });
  });

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
