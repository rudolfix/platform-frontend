import { isFunction } from "lodash";
import { spy } from "sinon";

// helper to generate quickly selector for data-test-ids
export function tid(id: string): string {
  return `[data-test-id="${id}"]`;
}

export function createMock<T>(clazz: new (...args: any[]) => T, mockImpl: Partial<T>): T {
  const callGuard = (methodName: string) => (...args: any[]) => {
    throw new Error(`Unexpected call to method: '${methodName}' with args: ${args}`);
  };
  // @todo: createMock can wrap whole object in proxy and prevent any access to not defined props

  const methods = clazz.prototype;
  const allMethods = new Set<string>();
  Object.getOwnPropertyNames(methods).forEach(name => allMethods.add(name));
  Object.keys(mockImpl).forEach(name => allMethods.add(name));
  allMethods.delete("constructor");

  let mock: any = {};

  allMethods.forEach(methodName => {
    const userProvidedMock = (mockImpl as any)[methodName];
    if (userProvidedMock && isFunction(userProvidedMock)) {
      mock[methodName] = spy(userProvidedMock);
    } else if ((mock[methodName] = userProvidedMock)) {
      mock[methodName] = userProvidedMock;
    } else {
      mock[methodName] = callGuard(methodName);
    }
  });

  return mock;
}
