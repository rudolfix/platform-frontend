import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { SwitchConnected } from "../../shared/connectedRouting";
import { etoRegisterRoutes } from "./routes";

import { EtoRegistrationCompanyInformation } from "./pages/CompanyInformation";
import { EtoEquityTokenInfo } from "./pages/EtoEquityTokenInfo";
import { EtoRegistrationMedia } from "./pages/EtoMedia";
import { EtoRegistrationTerms } from "./pages/EtoTerms";
import { EtoVotingRights } from "./pages/EtoVotingRights";
import { EtoRegistrationKeyIndividuals } from "./pages/KeyIndividuals";
import { EtoRegistrationLegalInformation } from "./pages/LegalInformation";
import { EtoRegistrationProductVision } from "./pages/ProductVision";
import { EtoRegistrationRiskAssessment } from "./pages/RiskAssessment";

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
    <Route
      path={etoRegisterRoutes.etoRiskAssessment}
      component={EtoRegistrationRiskAssessment}
      exact
    />
    <Route path={etoRegisterRoutes.etoTerms} component={EtoRegistrationTerms} exact />
    <Route path={etoRegisterRoutes.etoEquityTokenInfo} component={EtoEquityTokenInfo} exact />
    <Route path={etoRegisterRoutes.etoVotingRight} component={EtoVotingRights} exact />
    <Route path={etoRegisterRoutes.etoMedia} component={EtoRegistrationMedia} exact />
    <Redirect to={etoRegisterRoutes.companyInformation} />
  </SwitchConnected>
);
