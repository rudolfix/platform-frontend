import { EEtoState } from "@neufund/shared-modules";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ETOFormsProgressSectionComponent } from "./ETOFormsProgressSection";

const data = {
  etoStatus: EEtoState.LISTED,
  loadingData: false,
  shouldEtoDataLoad: false,
  companyInformationProgress: 100,
  legalInformationProgress: 1,
  etoTermsProgress: 1,
  etoKeyIndividualsProgress: 1,
  productVisionProgress: 1,
  etoMediaProgress: 1,
  etoRiskAssessmentProgress: 1,
  etoEquityTokenInfoProgress: 1,
  etoVotingRightsProgress: 1,
  etoInvestmentTermsProgress: 1,
};

storiesOf("ETO/ETOFormsProgressSection", module).add("default", () => (
  <ETOFormsProgressSectionComponent {...data} />
));
