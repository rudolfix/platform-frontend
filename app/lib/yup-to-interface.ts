import * as Yup from "yup";

export const object = <T>(objectShape: T) => new ObjectYTS(objectShape);
export const string = () => new StringYTS();
export const array = <T>(shape: T) => new ArrayYTS(shape);

type ToTypeSub<T> = T extends ObjectYTS<infer S, infer R>
  ? TOptional<{ [K in keyof S]: ToTypeSub<S[K]> }, R>
  : T extends ArrayYTS<infer S, infer R>
    ? TOptional<Array<S>, R>
    : T extends StringYTS<infer R> ? TOptional<string, R> : never;

export type ToType<T> = T extends ArrayYTS<infer S, infer R>
    ? TOptional<Array<ToTypeSub<S>>, R>
    : ToTypeSub<T>;

type TOptional<O, REQUIRED> = REQUIRED extends true ? O : O | undefined;

interface YTS {
  toYup(): Yup.AnySchemaConstructor;

  required(): YTS;
}

class ObjectYTS<T, R = false> {
  __TYPE__!: Unique<"object">;

  constructor(private objDescription: T) {}

  toYup(): Yup.AnySchemaConstructor {
    throw new Error("Method not implemented.");
  }

  required(): ObjectYTS<T, true> {
    throw new Error("Method not implemented.");
  }
}

class StringYTS<R = false> {
  __TYPE__!: Unique<"string">;

  toYup(): Yup.AnySchemaConstructor {
    throw new Error("Method not implemented.");
  }

  required(): StringYTS<true> {
    throw new Error("Method not implemented.");
  }
}

class ArrayYTS<T, R = false> {
  __TYPE__!: Unique<"array">;

  constructor(private shape: T) {}

  toYup(): Yup.AnySchemaConstructor {
    throw new Error("Method not implemented.");
  }

  required(): ArrayYTS<T, true> {
    throw new Error("Method not implemented.");
  }
}

export type Unique<K> = { __TYPE__: K };
