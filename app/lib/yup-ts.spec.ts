import { expect } from "chai";
import * as YupTS from "./yup-ts";

describe("yup-ts", () => {
  const animalValidator = YupTS.object({
    name: YupTS.string().optional(),
  });

  const personValidatorTemplate = YupTS.object({
    fullName: YupTS.string(),
    middleName: YupTS.string().optional(),
    age: YupTS.number(),
    married: YupTS.boolean().optional(),
    animals: YupTS.array(animalValidator).optional(),
  });

  type TValidatorType = YupTS.TypeOf<typeof personValidatorTemplate>;
  const validator = personValidatorTemplate.toYup();

  it("should work as yup", () => {
    const validValue1: TValidatorType = {
      fullName: "Typical Millennial Dev",
      middleName: undefined,
      age: 21,
      married: false,
      animals: undefined,
    };
    const validValue2 = { fullName: "Typical Millennial Dev", age: "21" }; // testing coercing
    const validValue3: TValidatorType = {
      fullName: "John Smith",
      middleName: "Peter",
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
  it("should generate correct types", () => {
    type assert<T> = T extends {
      fullName: string;
      middleName: string | undefined;
      age: number;
      married: boolean | undefined;
      animals: Array<{ name: string | undefined }> | undefined;
    }
      ? true
      : never;

    // tslint:disable-next-line
    const t: assert<TValidatorType> = true;
  });
});
