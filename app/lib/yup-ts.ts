import { mapValues } from "lodash";
import * as Yup from "yup";
import { Dictionary } from "../types";

export const object = <T>(objectShape: T) => new ObjectYTS(objectShape);
export const string = () => new StringYTS();
export const array = <T extends YTS<any>>(shape: T) => new ArrayYTS(shape);
export const number = () => new NumberYTS();
export const boolean = () => new BooleanYTS();
export const onlyTrue = () => new TrueYTS();

export type TypeOf<T extends YTS<any>> = T["_T"];
type TypeOfProps<P extends Dictionary<any>> = { [K in keyof P]: TypeOf<P[K]> };

export type Schema<T> = ObjectYTS<T>;

abstract class YTS<T> {
  _T!: T;

  abstract toYup(): Yup.Schema;

  abstract optional(): YTS<T | undefined>;
}

class ObjectYTS<T> extends YTS<TypeOfProps<T>> {
  __TYPE__!: Unique<"object">;

  constructor(public readonly shape: T, private isRequired: boolean = true) {
    super();
  }

  toYup(): Yup.Schema {
    const validator = Yup.object(mapValues(this.shape as any, s => s.toYup()));

    if (this.isRequired) {
      return validator.required("This field is required");
    }
    return validator;
  }

  optional(): ObjectYTS<T | undefined> {
    return new ObjectYTS(this.shape, false);
  }
}

class StringYTS extends YTS<string> {
  __TYPE__!: Unique<"string">;

  constructor(private isRequired: boolean = true) {
    super();
  }

  toYup(): Yup.Schema {
    const validator = Yup.string();

    if (this.isRequired) {
      return validator.required("This field is required");
    }
    return validator;
  }

  optional(): YTS<string | undefined> {
    return new StringYTS(false);
  }
}

class NumberYTS extends YTS<number> {
  __TYPE__!: Unique<"number">;

  constructor(private isRequired: boolean = true) {
    super();
  }

  toYup(): Yup.Schema {
    const validator = Yup.number();

    if (this.isRequired) {
      return validator.required("This field is required");
    }
    return validator;
  }

  optional(): YTS<number | undefined> {
    return new NumberYTS(false);
  }
}

class BooleanYTS extends YTS<boolean> {
  __TYPE__!: Unique<"boolean">;

  constructor(private isRequired: boolean = true) {
    super();
  }

  toYup(): Yup.Schema {
    const validator = Yup.boolean();

    if (this.isRequired) {
      return validator.required("This field is required");
    }
    return validator;
  }

  optional(): YTS<boolean | undefined> {
    return new BooleanYTS(false);
  }
}

class TrueYTS extends YTS<true> {
  __TYPE__!: Unique<"boolean">;

  constructor(private isRequired: boolean = true) {
    super();
  }

  toYup(): Yup.Schema {
    const validator = Yup.boolean().test(
      "isTrue",
      "This field is required",
      value => value === undefined || value === true,
    );

    if (this.isRequired) {
      return validator.required("This field is required");
    }
    return validator;
  }

  optional(): YTS<true | undefined> {
    return new TrueYTS(false);
  }
}

class ArrayYTS<T extends YTS<any>> extends YTS<Array<TypeOf<T>>> {
  __TYPE__!: Unique<"array">;

  constructor(private shape: T, private isRequired: boolean = true) {
    super();
  }

  toYup(): Yup.Schema {
    const validator = Yup.array().of(this.shape.toYup());

    if (this.isRequired) {
      return validator.required("This field is required");
    }
    return validator;
  }

  optional(): YTS<Array<TypeOf<T>> | undefined> {
    return new ArrayYTS(this.shape, false);
  }
}

type Unique<K> = { __TYPE__: K };
