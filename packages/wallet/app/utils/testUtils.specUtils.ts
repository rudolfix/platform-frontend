/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return */

import isFunction from "lodash/fp/isFunction";
import { set } from "mockdate";

const timeTravel = (msToAdvance: number) => {
  const now = Date.now();
  set(new Date(now + msToAdvance));
  jest.advanceTimersByTime(msToAdvance);
};

const setupTimeTravel = () => {
  set(0);
  jest.useFakeTimers();
};

const callGuard = (methodName: string) => (...args: any[]) => {
  throw new Error(`Unexpected call to method: '${methodName}' with args: ${args.toString()}`);
};

type TMOCK<T> = {
  [P in keyof T]: T[P] extends (...args: any) => any
    ? jest.Mock<ReturnType<T[P]>, Parameters<T[P]>>
    : T[P];
};

/**
 * A jest util to mock class methods.
 * Useful to mock partially class and be confident that all other class methods are never used.
 *
 * @param clazz - A class to mock
 * @param mockImpl - A mocked methods
 */
function createMock<T>(
  clazz: new (...args: any[]) => T,
  mockImpl: Partial<T>,
): T & {
  MOCK: TMOCK<T>;
} {
  const methods = clazz.prototype ?? {};

  const allMethods = new Set<string>([
    ...Object.getOwnPropertyNames(methods),
    ...Object.keys(mockImpl),
  ]);

  allMethods.delete("constructor");

  const mock: any = {};

  allMethods.forEach(methodName => {
    const userProvidedMock = (mockImpl as any)[methodName];

    if (userProvidedMock) {
      mock[methodName] = isFunction(userProvidedMock)
        ? jest.fn(userProvidedMock)
        : userProvidedMock;
    } else {
      mock[methodName] = jest.fn(callGuard(methodName));
    }
  });

  return { ...mock, MOCK: mock };
}

const RealDate = global.Date;

const mockDate = (mockedDate: Date) => {
  global.Date = class extends Date {
    constructor(value?: number | string | Date) {
      if (value) {
        super(value);
      } else {
        // eslint-disable-next-line no-constructor-return
        return mockedDate;
      }
    }

    static now = () => mockedDate.valueOf();
  } as DateConstructor;

  return {
    reset: () => {
      global.Date = RealDate;
    },
  };
};

export { createMock, timeTravel, setupTimeTravel, mockDate };
