import * as YupTS from "./yup-ts";
import { expect } from "chai";

describe.only("yup-ts", () => {
  const animalValidator = YupTS.object({
    name: YupTS.string().required(),
  });

  const personValidatorTemplate = YupTS.object({
    fullName: YupTS.string().required(),
    age: YupTS.number().required(),
    married: YupTS.boolean(),
    animals: YupTS.array(animalValidator),
  }).required();

  type TValidatorType = YupTS.ToType<typeof personValidatorTemplate>;
  const validator = personValidatorTemplate.toYup();

  it("should work as yup", () => {
    const validValue1: TValidatorType = {
      fullName: "Typical Millennial Dev",
      age: 21,
      married: false,
      animals: undefined,
    };
    const validValue2 = { fullName: "Typical Millennial Dev", age: "21" }; // testing coercing
    const validValue3: TValidatorType = {
      fullName: "John Smith",
      age: 21,
      married: false,
      animals: [{ name: "kitty" }],
    };

    expect(validator.isValidSync(validValue1)).to.be.true;
    expect(validator.isValidSync(validValue2)).to.be.true;
    expect(validator.isValidSync(validValue3)).to.be.true;

    expect(validator.isValidSync(5)).to.be.false;
    expect(validator.isValidSync({ name: "test" })).to.be.false; // missing values
  });

  // assertions on types done according to: https://abstract.properties/typescript-compile-assertions.html
  it("should generate correct types", () => {});
});
