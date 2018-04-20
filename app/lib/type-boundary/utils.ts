import { Left } from "fp-ts/lib/Either";
import * as t from "io-ts";
import { Dictionary } from "../../types";

interface ICustomValidationError extends t.ValidationError {
  message?: string;
}

export const withMessage = <A, O>(
  type: t.Type<A, O, t.mixed>,
  message: string,
): t.Type<A, O, t.mixed> => {
  return new t.Type(
    type.name,
    type.is,
    (m: any, c: any) =>
      type
        .validate(m, c)
        .mapLeft((errors: any) => errors.map((e: ICustomValidationError) => ({ ...e, message }))),
    type.encode,
  );
};

export const humanizeValidation = (result: any) => {
  if (result instanceof Left) {
    const errorObject: any = {};
    result.value.forEach((validationResult: any) => {
      errorObject[
        validationResult.context
          .map((v: any) => v.key)
          .slice(1)
          .join(".")
      ] =
        validationResult.message;
    });

    return errorObject;
  } else {
    return undefined;
  }
};

export const formikValidator = (type: t.Type<any, any, any>) => (values: Dictionary<any>) => {
  return humanizeValidation(type.decode(values));
};
