import * as t from "io-ts";
import { withMessage } from "./utils";

const ERROR_MSG = "Value is not a number";

const isNumberReg = /^[0-9\.]+$/;

class NumberFromStringType extends t.Type<number, string> {
  readonly _tag: "NumberFromStringType" = "NumberFromStringType";
  constructor() {
    super(
      "NumberFromString",
      t.number.is,
      (rawValue, ctx) => {
        const validation = t.string.validate(rawValue, ctx);
        if (validation.isLeft()) {
          return validation as any;
        }
        const value = validation.value;

        const isValid = isNumberReg.test(value);
        if (!isValid) {
          return t.failure(value, ctx);
        }

        return t.success(parseFloat(value));
      },
      String,
    );
  }
}

export const NumberFromString = withMessage(new NumberFromStringType(), ERROR_MSG);
