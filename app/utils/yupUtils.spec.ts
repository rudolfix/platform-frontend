import { expect } from "chai";
import * as Yup from "yup";

import { getField, isRequired } from "./yupUtils";

describe("yupUtils", () => {
  describe("isRequired", () => {
    it("should return true for required field", () => {
      const schema = Yup.object().shape({
        id: Yup.string().required(),
      });

      const idField = getField("id", schema);

      expect(isRequired(idField)).to.be.true;
    });

    it("should return false for optional field", () => {
      const schema = Yup.object().shape({
        name: Yup.string(),
      });

      const nameField = getField("name", schema);

      expect(isRequired(nameField)).to.be.false;
    });
  });
});
