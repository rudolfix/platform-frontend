import { expect } from "chai";
import { Left } from "fp-ts/lib/Either";

export function expectValidationError(value: any, errorMsg: string): void {
  expect(value).to.be.be.instanceof(Left);
  expect(value.value[0].message).to.be.be.eq(errorMsg);
}
