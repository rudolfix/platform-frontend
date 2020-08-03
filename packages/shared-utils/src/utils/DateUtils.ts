import jstz from "jstimezonedetect";
import moment from "moment";

const DAY = 24 * 60 * 60;

/**
 *  Formats date to dd-mm-yyyy format
 *
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("de", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function isLessThanNDays(d1: Date, d2: Date, n: number): boolean {
  return d2.getTime() - d1.getTime() < 1000 * DAY * n;
}

export function isLessThanNHours(d1: Date, d2: Date, n: number): boolean {
  return d2.getTime() - d1.getTime() < 1000 * 60 * 60 * n;
}

export function isLessThanNMinutes(d1: Date, d2: Date, n: number): boolean {
  return d2.getTime() - d1.getTime() < 1000 * 60 * n;
}

export function minutesToMs(minutes: number): number {
  return minutes * 6 * 10 * 1000;
}

export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

export const calculateTimeLeftUnits = (timeLeft: number): [number, number, number, number] => {
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(timeLeft / day);
  const hours = Math.floor((timeLeft % day) / hour);
  const minutes = Math.floor(((timeLeft % day) % hour) / minute);
  const seconds = Math.floor(((timeLeft % day) % hour) % minute);

  return [days, hours, minutes, seconds];
};

export const calculateTimeLeft = (
  value: moment.Moment | Date,
  asUtc: boolean,
  unit: moment.unitOfTime.Diff = "seconds",
) => (asUtc ? moment.utc(value).diff(moment().utc(), unit) : moment(value).diff(moment(), unit));

export const getTomorrowsDate = () =>
  moment()
    .utc()
    .add(1, "day")
    .startOf("day")
    .toDate();

export const utcTime = (value: moment.MomentInput) =>
  moment.utc(value).format("MMMM Do YYYY, HH:mm");
export const localTime = (value: moment.MomentInput) => moment(value).format("MMMM Do YYYY, HH:mm");
export const timeZone = () => jstz.determine().name();
export const weekdayLocal = (date: moment.MomentInput) => moment(date).format("ddd");
export const weekdayUTC = (date: moment.MomentInput) => moment.utc(date).format("ddd");

export const getCurrentUTCTimestamp = (): number => Math.floor(Date.now() / 1000);
