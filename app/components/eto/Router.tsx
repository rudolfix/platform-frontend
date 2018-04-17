import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { SwitchConnected } from "../shared/connectedRouting";
import { etoRoutes } from "./routes";

import { EtoRegistrationTerms } from "./registration/EtoTerms";
import { EtoRegistrationMarketInformation } from "./registration/MarketInformation";
import { EtoRegistrationProductAndVision } from "./registration/ProductAndVision";
import { EtoRegistrationTeamAndInvestors } from "./registration/TeamAndInvestors";

export const EtoRouter: React.SFC = () => (
  <SwitchConnected>
    <Route path={etoRoutes.teamAndInvestors} component={EtoRegistrationTeamAndInvestors} exact />
    <Route path={etoRoutes.marketInformation} component={EtoRegistrationMarketInformation} exact />
    <Route path={etoRoutes.productAndVision} component={EtoRegistrationProductAndVision} exact />
    <Route path={etoRoutes.etoTerms} component={EtoRegistrationTerms} exact />
    <Redirect to={etoRoutes.teamAndInvestors} />
  </SwitchConnected>
);
