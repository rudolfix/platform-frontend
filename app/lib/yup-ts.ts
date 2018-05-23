import * as Yup from "yup";
import { valid } from "semver";
import { mapValues } from "lodash";

export const object = <T>(objectShape: T) => new ObjectYTS(objectShape);
export const string = () => new StringYTS();
export const array = <T extends YTS>(shape: T) => new ArrayYTS(shape);
export const number = () => new NumberYTS();
export const boolean = () => new BooleanYTS();

type ToTypeSub<T> = T extends ObjectYTS<infer S, infer R>
  ? TOptional<{ [K in keyof S]: ToType<S[K]> }, R>
  : T extends ArrayYTS<infer S, infer R>
    ? TOptional<Array<S>, R>
    : T extends StringYTS<infer R>
      ? TOptional<string, R>
      : T extends NumberYTS<infer R>
        ? TOptional<number, R>
        : T extends BooleanYTS<infer R> ? TOptional<boolean, R> : never;

export type ToType<T> = T extends ArrayYTS<infer S, infer R>
  ? TOptional<Array<ToTypeSub<S>>, R>
  : ToTypeSub<T>;

type TOptional<O, REQUIRED> = REQUIRED extends true ? O : O | undefined;

interface YTS {
  toYup(): Yup.Schema;

  required(): YTS;
}

class ObjectYTS<T, R = false> {
  __TYPE__!: Unique<"object">;

  constructor(private shape: T, private isRequired: boolean = false) {}

  toYup(): Yup.Schema {
    const validator = Yup.object(mapValues(this.shape, s => s.toYup()));

    if (this.isRequired) {
      return validator.required();
    }
    return validator;
  }

  required(): ObjectYTS<T, true> {
    return new ObjectYTS(this.shape, true);
  }
}

class StringYTS<R = false> {
  __TYPE__!: Unique<"string">;

  constructor(private isRequired: boolean = false) {}

  toYup(): Yup.Schema {
    const validator = Yup.string();

    if (this.required) {
      return validator.required();
    }
    return validator;
  }

  required(): StringYTS<true> {
    return new StringYTS(true);
  }
}

class NumberYTS<R = false> {
  __TYPE__!: Unique<"number">;

  constructor(private isRequired: boolean = false) {}

  toYup(): Yup.Schema {
    const validator = Yup.number();

    if (this.isRequired) {
      return validator.required();
    }
    return validator;
  }

  required(): NumberYTS<true> {
    return new NumberYTS(true);
  }
}

class BooleanYTS<R = false> {
  __TYPE__!: Unique<"boolean">;

  constructor(private isRequired: boolean = false) {}

  toYup(): Yup.Schema {
    const validator = Yup.boolean();

    if (this.isRequired) {
      return validator.required();
    }
    return validator;
  }

  required(): BooleanYTS<true> {
    return new BooleanYTS(true);
  }
}

class ArrayYTS<T extends YTS, R = false> {
  __TYPE__!: Unique<"array">;

  constructor(private shape: T, private isRequired: boolean = false) {}

  toYup(): Yup.Schema {
    const validator = Yup.array().of(this.shape.toYup());

    if (this.isRequired) {
      return validator.required();
    }
    return validator;
  }

  required(): ArrayYTS<T, true> {
    return new ArrayYTS(this.shape, true);
  }
}

type Unique<K> = { __TYPE__: K };
