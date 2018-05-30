import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { VerificationStatus } from "../../shared/VerificationStatus";

const steps = [
  {
    label: "Company Information",
    isChecked: false,
  },
  {
    label: "Legal Information",
    isChecked: false,
  },
  {
    label: "Key Individuals",
    isChecked: false,
  },
  {
    label: "Product Vision",
    isChecked: false,
  },
  {
    label: "ETO terms",
    isChecked: false,
  },
];

export const EtoProgressBar: React.SFC<CommonHtmlProps> = props => (
  <VerificationStatus steps={steps} {...props} />
);
