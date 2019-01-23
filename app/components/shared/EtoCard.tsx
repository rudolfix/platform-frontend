import * as React from "react";

import { EtoData } from "../../data/etoCompanies";
import { CommonHtmlProps } from "../../types";
import { EtoOfferingCard } from "./EtoOfferingCard";

export const EtoCard: React.FunctionComponent<EtoData & CommonHtmlProps> = props => {
  // note: we can't destruct props before because then type inference for discriminated unions fails
  const { data, ...htmlProps } = props;
  return <EtoOfferingCard {...data} {...htmlProps} />;
};
