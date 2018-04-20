import * as t from "io-ts";

import { withMessage } from "../type-boundary/utils";

export const nonEmptyStringType = withMessage(
  t.refinement(t.string, s => s !== ""),
  "Value is not a string",
);
export const numberType = withMessage(t.number, "Value is not a number");
