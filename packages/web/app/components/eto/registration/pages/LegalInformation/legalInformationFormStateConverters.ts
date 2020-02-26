import {
  convertInArray,
  convertNumberToString,
  parseStringToFloat,
  parseStringToInteger,
  removeDefaultValues,
  removeEmptyKeyValueFields,
} from "../../../utils";

const toFormState = {
  useOfCapitalList: [convertInArray({ shareCapital: convertNumberToString() })],
  companyShareCapital: convertNumberToString(),
  numberOfFounders: convertNumberToString(),
  lastFundingSizeEur: convertNumberToString(),
};

const fromFormState = {
  shareholders: [
    removeEmptyKeyValueFields(),
    convertInArray({ shareCapital: parseStringToInteger() }),
  ],
  companyShareCapital: parseStringToInteger(),
  lastFundingSizeEur: parseStringToFloat(),
  numberOfFounders: parseStringToInteger(),
  companyStage: removeDefaultValues("NONE_KEY"),
};

export { toFormState, fromFormState };
