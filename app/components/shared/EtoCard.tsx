import * as React from "react";

import { EtoData } from "../../data/etoCompanies";
import { EtoOfferingCard } from "./EtoOfferingCard";
import { EtoOfferingSoon } from "./EtoOfferingSoon";

export const EtoCard: React.SFC<EtoData> = props => {
  if (props.type === "offering") {
    return <EtoOfferingCard {...props.data} />;
  } else {
    return <EtoOfferingSoon {...props.data} />;
  }
};
