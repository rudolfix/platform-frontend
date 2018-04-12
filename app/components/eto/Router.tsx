import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { EtoRegistrationCompanyInformation } from "./registration/CompanyInformation";
import { EtoRegistrationTerms } from "./registration/EtoTerms";
import { EtoRegistrationLegalRepresentative } from "./registration/LegalRepresentative";
import { EtoRegistrationMarketInformation } from "./registration/MarketInformation";
import { EtoRegistrationProductAndVision } from "./registration/ProductAndVision";
import { EtoRegistrationTeamAndInvestors } from "./registration/TeamAndInvestors";

import { etoRoutes } from "./routes";

export const EtoRouter: React.SFC = () => (
  <Switch>
    <Route
      path={etoRoutes.companyInformation}
      component={EtoRegistrationCompanyInformation}
      exact
    />
    <Route
      path={etoRoutes.legalRepresentative}
      component={EtoRegistrationLegalRepresentative}
      exact
    />
    <Route path={etoRoutes.teamAndInvestors} component={EtoRegistrationTeamAndInvestors} exact />
    <Route path={etoRoutes.marketInformation} component={EtoRegistrationMarketInformation} exact />
    <Route path={etoRoutes.productAndVision} component={EtoRegistrationProductAndVision} exact />
    <Route path={etoRoutes.etoTerms} component={EtoRegistrationTerms} exact />

    <Redirect to={etoRoutes.companyInformation} />
  </Switch>
);
