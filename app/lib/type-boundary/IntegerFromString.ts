import * as t from "io-ts";
import { isInteger } from "lodash";
import { NumberFromString } from "./NumberFromString";
import { withMessage } from "./utils";

const ERROR_MSG = "Value is not an integer";

export const IntegerFromString = withMessage(
  t.refinement(NumberFromString, n => isInteger(n)),
  ERROR_MSG,
);
