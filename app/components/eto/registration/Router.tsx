import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { SwitchConnected } from "../../shared/connectedRouting";
import { etoRegisterRoutes } from "./routes";

import { EtoRegistrationCompanyInformation } from "./pages/CompanyInformation";
import { EtoRegistrationMedia } from "./pages/EtoMedia";
import { EtoRegistrationTerms } from "./pages/EtoTerms";
import { EtoRegistrationKeyIndividuals } from "./pages/KeyIndividuals";
import { EtoRegistrationLegalInformation } from "./pages/LegalInformation";
import { EtoRegistrationProductVision } from "./pages/ProductVision";

export const EtoRegisterRouter: React.SFC = () => (
  <SwitchConnected>
    <Route
      path={etoRegisterRoutes.companyInformation}
      component={EtoRegistrationCompanyInformation}
      exact
    />
    <Route
      path={etoRegisterRoutes.legalInformation}
      component={EtoRegistrationLegalInformation}
      exact
    />
    <Route
      path={etoRegisterRoutes.keyIndividuals}
      component={EtoRegistrationKeyIndividuals}
      exact
    />
    <Route path={etoRegisterRoutes.productVision} component={EtoRegistrationProductVision} exact />
    <Route path={etoRegisterRoutes.etoTerms} component={EtoRegistrationTerms} exact />
    <Route path={etoRegisterRoutes.etoMedia} component={EtoRegistrationMedia} exact />
    <Redirect to={etoRegisterRoutes.companyInformation} />
  </SwitchConnected>
);
