import { expect } from "chai";
import * as Yup from "yup";

import { selectFormFractionDone } from "../selectors";

describe("eto-flow > selectors", () => {
  describe("selectFormFractionDone", () => {
    it("should work with flat schema", () => {
      const validator = Yup.object({
        name: Yup.string().required(),
        age: Yup.number().required(),
        surname: Yup.string(),
      });
      const formState = { name: "test" };

      const fractionDone = selectFormFractionDone(validator, formState);

      expect(fractionDone).to.be.closeTo(1 / 3, 0.001);
    });

    it("should work with nested schema", () => {
      const nameValidator = Yup.object({
        name: Yup.string().required(),
        secondName: Yup.string(),
        lastName: Yup.string().required(),
      });
      const validator = Yup.object({
        details: nameValidator.required(),
        age: Yup.number().required(),
      });
      const formState = { details: { name: "test" } };

      const fractionDone = selectFormFractionDone(validator, formState);

      expect(fractionDone).to.be.closeTo(0.25, 0.001);
    });

    it("should work with arrays", () => {
      const nameValidator = Yup.array().of(Yup.object({
        name: Yup.string().required(),
        lastName: Yup.string()
      }));
      const validator = Yup.object({
        details: nameValidator,
        age: Yup.number().required(),
      });
      const formState = { details: [{ name: "test" }, {}, {}] };

      const fractionDone = selectFormFractionDone(validator, formState);

      expect(fractionDone).to.be.closeTo(1/7, 0.0001);
    });
  });
});
