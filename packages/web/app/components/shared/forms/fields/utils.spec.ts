import { expect } from "chai";
import * as Yup from "yup";

import { EMimeType, generateFileInformationDescription, isFieldRequired, isValid } from "./utils";

describe("Form utils", () => {
  describe("isValid", () => {
    it("should return true when not touched and not submitted", () => {
      const result = isValid(false, undefined, 0);

      expect(result).to.be.true;
    });

    it("should return false when touched and with error", () => {
      const result = isValid(true, "Error", 0);

      expect(result).to.be.false;
    });

    it("should return false when not touched, submitted and with error", () => {
      const result = isValid(false, "Error", 1);

      expect(result).to.be.false;
    });

    it("should return true when touched and without error", () => {
      const result = isValid(true, undefined, 0);

      expect(result).to.be.true;
    });

    it("should return false when not touched but with error", () => {
      const result = isValid(false, "Error", 0, true);

      expect(result).to.be.false;
    });
  });
});

describe("isFieldRequired", () => {
  it("should return true for a required field with yup schema", () => {
    const schema = Yup.object({ key: Yup.string().required() });
    expect(isFieldRequired(schema, "key")).to.be.true;
  });

  it("should return false for an optional field with yup schema", () => {
    const schema = Yup.object({ key1: Yup.string(), key2: Yup.string().notRequired() });
    expect(isFieldRequired(schema, "key1")).to.be.false;
    expect(isFieldRequired(schema, "key2")).to.be.false;
  });
});

describe("generateFileInformationDescription", () => {
  it("should generate file description if fileFormatInformation is not given", () => {
    const input = generateFileInformationDescription(
      [EMimeType.JPG, EMimeType.PDF, EMimeType.SVG, EMimeType.PNG],
      { width: 100, height: 200 },
    );
    const expectedOutput = "100px × 200px, jpg, pdf, svg or png";

    expect(input).to.eq(expectedOutput);
  });

  it("should not insert any delimiter if there's only one file type", () => {
    const input = generateFileInformationDescription([EMimeType.JPG], { width: 100, height: 200 });
    const expectedOutput = "100px × 200px, jpg";

    expect(input).to.eq(expectedOutput);
  });

  it("should insert an ' or ' if there are two file types", () => {
    const input = generateFileInformationDescription([EMimeType.JPG, EMimeType.PNG], {
      width: 100,
      height: 200,
    });
    const expectedOutput = "100px × 200px, jpg or png";

    expect(input).to.eq(expectedOutput);
  });

  it("should work without dimensions too", () => {
    const input = generateFileInformationDescription([EMimeType.JPG, EMimeType.PNG], undefined);
    const expectedOutput = "jpg or png";

    expect(input).to.eq(expectedOutput);
  });
});
