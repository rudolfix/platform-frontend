import * as Yup from "yup";
import { valid } from "semver";
import { mapValues } from "lodash";
import { Dictionary } from "../types";

export const object = <T>(objectShape: T) => new ObjectYTS(objectShape);
export const string = () => new StringYTS();
export const array = <T extends YTS<any>>(shape: T) => new ArrayYTS(shape);
export const number = () => new NumberYTS();
export const boolean = () => new BooleanYTS();

export type TypeOf<T extends YTS<any>> = T["_T"];
type TypeOfProps<P extends Dictionary<any>> = { [K in keyof P]: TypeOf<P[K]> };

type TOptional<O, REQUIRED> = REQUIRED extends true ? O : O | undefined;

abstract class YTS<T> {
  _T!: T;

  abstract toYup(): Yup.Schema;

  abstract optional(): YTS<T | undefined>;
}

class ObjectYTS<T> extends YTS<TypeOfProps<T>> {
  __TYPE__!: Unique<"object">;

  constructor(private shape: T, private isRequired: boolean = true) {
    super();
  }

  toYup(): Yup.Schema {
    const validator = Yup.object(mapValues(this.shape, s => s.toYup()));

    if (this.isRequired) {
      return validator.required();
    }
    return validator;
  }

  optional(): ObjectYTS<T | undefined> {
    return new ObjectYTS(this.shape, false);
  }
}

class StringYTS<R = false> extends YTS<string> {
  __TYPE__!: Unique<"string">;

  constructor(private isRequired: boolean = true) {
    super();
  }

  toYup(): Yup.Schema {
    const validator = Yup.string();

    if (this.optional) {
      return validator.required();
    }
    return validator;
  }

  optional(): StringYTS<string | undefined> {
    return new StringYTS(false);
  }
}

class NumberYTS<R = false> extends YTS<number> {
  __TYPE__!: Unique<"number">;

  constructor(private isRequired: boolean = true) {
    super();
  }

  toYup(): Yup.Schema {
    const validator = Yup.number();

    if (this.isRequired) {
      return validator.required();
    }
    return validator;
  }

  optional(): YTS<number | undefined> {
    return new NumberYTS(false);
  }
}

class BooleanYTS<R = false> extends YTS<boolean> {
  __TYPE__!: Unique<"boolean">;

  constructor(private isRequired: boolean = true) {
    super();
  }

  toYup(): Yup.Schema {
    const validator = Yup.boolean();

    if (this.isRequired) {
      return validator.required();
    }
    return validator;
  }

  optional(): YTS<boolean | undefined> {
    return new BooleanYTS(false);
  }
}

class ArrayYTS<T extends YTS<any>, R = false> extends YTS<Array<TypeOf<T>>> {
  __TYPE__!: Unique<"array">;

  constructor(private shape: T, private isRequired: boolean = true) {
    super();
  }

  toYup(): Yup.Schema {
    const validator = Yup.array().of(this.shape.toYup());

    if (this.isRequired) {
      return validator.required();
    }
    return validator;
  }

  optional(): YTS<Array<TypeOf<T>> | undefined> {
    return new ArrayYTS(this.shape, false);
  }
}

type Unique<K> = { __TYPE__: K };
