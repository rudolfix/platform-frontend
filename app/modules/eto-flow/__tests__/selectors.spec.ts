import { expect } from "chai";
import * as Yup from "yup";

import { selectFormFractionDone } from "../selectors";

describe("eto-flow > selectors", () => {
  describe("selectFormFractionDone", () => {
    it("should work with flat schema on all string, number and required fields", () => {
      const validator = Yup.object({
        name: Yup.string(),
        age: Yup.number(),
        happy: Yup.boolean().required()
      });
      const formState = { name: "test" };

      const fractionDone = selectFormFractionDone(validator, formState);

      expect(fractionDone).to.be.closeTo(1 / 3, 0.001);
    });

    it("should work with nested schema", () => {
      const nameValidator = Yup.object({
        name: Yup.string(),
        secondName: Yup.string(),
        lastName: Yup.string()
      });
      const validator = Yup.object({
        details: nameValidator,
        age: Yup.number(),
      });
      const formState = { details: { name: "test" } };

      const fractionDone = selectFormFractionDone(validator, formState);

      expect(fractionDone).to.be.eq(0.25);
    });

    it("should work with arrays", () => {
      const arrayValidator = Yup.array().of(Yup.object({
        name: Yup.string(),
        lastName: Yup.string()
      }));
      const validator = Yup.object({
        details: arrayValidator,
        age: Yup.number(),
      });
      const formState = { details: [{ name: "test" }, {}, {}] };

      const fractionDone = selectFormFractionDone(validator, formState);

      expect(fractionDone).to.be.closeTo(1/7, 0.0001);
    });

    it('should be able to ignore some properties, except explicitly specified as required', () => {
      const arrayValidator = Yup.array().of(Yup.object({
        name: Yup.string(),
        lastName: Yup.string()
      }));
      const validator = Yup.object({
        details: arrayValidator,
        age: Yup.number(),
      });
      const formState = { details: [{ name: "test" }, {}, {}] };

      const fractionDone1 = selectFormFractionDone(validator, formState);
      const fractionDone2 = selectFormFractionDone(validator, formState, { ignore: { age: true } });
      const fractionDone3 = selectFormFractionDone(validator, formState, { ignore: { details: true } });
      const fractionDone4 = selectFormFractionDone(validator, formState, { ignore: { details: [{ lastName: true }] } });

      expect(fractionDone1).to.be.closeTo(1/7, 0.0001);
      expect(fractionDone3).to.be.closeTo(0/2, 0.0001);
      expect(fractionDone2).to.be.closeTo(1/6, 0.0001);
      expect(fractionDone4).to.be.closeTo(1/4, 0.0001);
    })
  });
});
