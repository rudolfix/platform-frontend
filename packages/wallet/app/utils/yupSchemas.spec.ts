import { AssertEqual, assertType } from "@neufund/shared/tests";
import * as yup from "yup";

import { singleValue, typedValue, oneOfSchema } from "./yupSchemas";

type YupPrimitiveInfer<T> = T extends yup.Schema<infer T> ? T : never;

describe("yup custom schemas", () => {
  describe("singleValue", () => {
    it("should allow only single value", () => {
      type ExpectedType = "true";
      const value: ExpectedType = "true";

      const singleValueSchema = singleValue(value);

      // assert proper type inference
      type Type = YupPrimitiveInfer<typeof singleValueSchema>;
      assertType<AssertEqual<Type, ExpectedType>>(true);

      expect(singleValueSchema.isValidSync(undefined)).toBeTruthy();
      expect(singleValueSchema.isValidSync(null)).toBeTruthy();

      expect(singleValueSchema.isValidSync("true")).toBeTruthy();

      expect(singleValueSchema.isValidSync("false")).toBeFalsy();
    });
  });

  describe("typedValue", () => {
    it("should allow only value from type guard", () => {
      type ExpectedType = "true" | 1;

      const typedValueSchema = typedValue(
        (v: unknown): v is ExpectedType => v === "true" || v === 1,
      );

      // assert proper type inference
      type Type = YupPrimitiveInfer<typeof typedValueSchema>;
      assertType<AssertEqual<Type, ExpectedType>>(true);

      expect(typedValueSchema.isValidSync(undefined)).toBeTruthy();
      expect(typedValueSchema.isValidSync(null)).toBeTruthy();

      expect(typedValueSchema.isValidSync("true")).toBeTruthy();
      expect(typedValueSchema.isValidSync(1)).toBeTruthy();

      expect(typedValueSchema.isValidSync("false")).toBeFalsy();
    });
  });

  describe("oneOfSchema", () => {
    it("should allow any of schema values", () => {
      const schema1 = yup.number();
      const schema2 = yup.object({ foo: yup.string().required() });
      const schema3 = yup.object({ bar: yup.boolean().required() });

      const oneOfTypeSchema = oneOfSchema([schema1, schema2, schema3]);

      // assert proper type inference
      type Type = YupPrimitiveInfer<typeof oneOfTypeSchema>;
      assertType<
        AssertEqual<Type, number | yup.InferType<typeof schema2> | yup.InferType<typeof schema3>>
      >(true);

      expect(oneOfTypeSchema.isValidSync(undefined)).toBeTruthy();
      expect(oneOfTypeSchema.isValidSync(null)).toBeTruthy();

      expect(oneOfTypeSchema.isValidSync(100)).toBeTruthy();
      expect(oneOfTypeSchema.isValidSync({ foo: "bar" })).toBeTruthy();
      expect(oneOfTypeSchema.isValidSync({ bar: false })).toBeTruthy();

      expect(oneOfTypeSchema.isValidSync({})).toBeFalsy();
      expect(oneOfTypeSchema.isValidSync({ bar: "foo" })).toBeFalsy();
      expect(oneOfTypeSchema.isValidSync("some string")).toBeFalsy();
    });
  });
});
