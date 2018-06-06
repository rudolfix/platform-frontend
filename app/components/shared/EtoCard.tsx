import * as React from "react";

import { EtoData } from "../../data/etoCompanies";
import { CommonHtmlProps } from "../../types";
import { EtoOfferingCard } from "./EtoOfferingCard";
import { EtoOfferingSoon } from "./EtoOfferingSoon";

export const EtoCard: React.SFC<EtoData & CommonHtmlProps> = props => {
  // note: we can't destruct props before because then type inference for discriminated unions fails
  if (props.type === "offering") {
    const { data, type, ...htmlProps } = props;
    return <EtoOfferingCard {...data} {...htmlProps} />;
  } else {
    const { data, type, ...htmlProps } = props;
    return <EtoOfferingSoon {...data} {...htmlProps} />;
  }
};
