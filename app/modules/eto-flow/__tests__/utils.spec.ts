import { expect } from "chai";
import * as Yup from "yup";

import { getFormFractionDoneCalculator, getInitialDataForFractionCalculation } from "../utils";

describe("eto-flow > selectors", () => {
  describe("selectFormFractionDone", () => {
    it("should work with flat schema on all string, number and required fields", () => {
      const validator = Yup.object({
        name: Yup.string(),
        age: Yup.number(),
        happy: Yup.boolean().required(),
      });
      const formState = { name: "test" };

      const fractionDone = getFormFractionDoneCalculator(validator)(formState);

      expect(fractionDone).to.be.closeTo(1 / 3, 0.001);
    });

    it("should work with nested schema", () => {
      const nameValidator = Yup.object({
        name: Yup.string(),
        secondName: Yup.string(),
        lastName: Yup.string(),
      });
      const validator = Yup.object({
        details: nameValidator,
        age: Yup.number(),
      });
      const formState = { details: { name: "test" } };

      const fractionDone = getFormFractionDoneCalculator(validator)(formState);

      expect(fractionDone).to.be.eq(0.25);
    });

    it("should work with arrays", () => {
      const arrayValidator = Yup.array().of(
        Yup.object({
          name: Yup.string(),
          lastName: Yup.string(),
        }),
      );
      const validator = Yup.object({
        details: arrayValidator,
        age: Yup.number(),
      });
      const formState = { details: [{ name: "test" }, {}, {}] };

      const fractionDone = getFormFractionDoneCalculator(validator)(formState);

      expect(fractionDone).to.be.closeTo(1 / 7, 0.0001);
    });

    it("should be able to ignore some properties, except explicitly specified as required", () => {
      const arrayValidator = Yup.array().of(
        Yup.object({
          name: Yup.string(),
          lastName: Yup.string(),
        }),
      );
      const validator = Yup.object({
        details: arrayValidator,
        age: Yup.number(),
      });
      const formState = { details: [{ name: "test" }, {}, {}] };

      const calculate1 = getFormFractionDoneCalculator(validator);
      const calculate2 = getFormFractionDoneCalculator(validator, { ignore: { age: true } });
      const calculate3 = getFormFractionDoneCalculator(validator, {
        ignore: { details: true },
      });
      const calculate4 = getFormFractionDoneCalculator(validator, {
        ignore: { details: [{ lastName: true }] },
      });
      const calculate5 = getFormFractionDoneCalculator(validator, {
        ignore: true,
      });
      const fractionDone1 = calculate1(formState);
      const fractionDone2 = calculate2(formState);
      const fractionDone3 = calculate3(formState);
      const fractionDone4 = calculate4(formState);
      const fractionDone5 = calculate5(formState);

      expect(fractionDone1).to.be.closeTo(1 / 7, 0.0001);
      expect(fractionDone3).to.be.closeTo(0 / 2, 0.0001);
      expect(fractionDone2).to.be.closeTo(1 / 6, 0.0001);
      expect(fractionDone4).to.be.closeTo(1 / 4, 0.0001);
      expect(fractionDone5).to.be.closeTo(1, 0.0001);
    });
  });

  describe("getInitialDataForFractionCalculation", () => {
    it("generates empty object with the same form as the input data", () => {
      const data = getInitialDataForFractionCalculation({
        foo: 1234,
        bar: "asdff",
        arr: [{ foo: 1234 }, { bar: 1234 }],
        obj: {
          foo: {
            bar: false,
          },
        },
      });

      expect(data).to.deep.equal({
        foo: undefined,
        bar: undefined,
        arr: [{ foo: undefined }, { bar: undefined }],
        obj: { foo: { bar: undefined } },
      });
    });
  });
});
